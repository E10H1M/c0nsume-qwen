// routes/upload.rs

use actix_web::{web, HttpResponse, Responder, HttpRequest};
use actix_web::http::StatusCode as ActixStatusCode;
use actix_multipart::Multipart;
use futures_util::StreamExt; // for .next()
use reqwest::Client;
use uuid::Uuid;

use crate::consts::{
    PATH_IMAGE_UPLOAD, join_base, server_image_upload,
    server_mode, server_image,
};

// ---------- PROXY (local/python) ----------
// forwards request body as-is to the Python backend
async fn upload_image_proxy(
    req: HttpRequest,
    payload: web::Bytes,
    client: web::Data<Client>,
) -> impl Responder {
    let mut builder = client.post(join_base(&server_image_upload(), PATH_IMAGE_UPLOAD));

    if let Some(ct) = req.headers().get("content-type") {
        if let Ok(ct_str) = ct.to_str() {
            builder = builder.header("content-type", ct_str);
        }
    }

    let res = builder.body(payload.to_vec()).send().await;

    match res {
        Ok(resp) => {
            let status = ActixStatusCode::from_u16(resp.status().as_u16())
                .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
            let body = resp.text().await.unwrap_or_else(|_| "Failed to read backend response".to_string());
            HttpResponse::build(status).body(body)
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// ---------- BUCK3T (direct) ----------
// consumes multipart, takes the "file" part, uploads to buck3t as /objects/uploads/{uid}.png
async fn upload_image_buck3t(
    mut mp: Multipart,
    client: web::Data<Client>,
) -> impl Responder {
    // find the "file" field
    let mut found = false;
    let mut file_bytes = web::BytesMut::new();
    let mut content_type_hdr: Option<String> = None;

    while let Some(item) = mp.next().await {
        let mut field = match item {
            Ok(f) => f,
            Err(e) => return HttpResponse::BadRequest().body(format!("Malformed multipart: {e}")),
        };

        // We only care about the "file" field, ignore others
        if field.name() != Some("file") {
            // drain this field to move on
            while let Some(chunk) = field.next().await {
                if chunk.is_err() { break; }
            }
            continue;
        }

        // mime from the part if present (fall back later)
        if let Some(mt) = field.content_type() {
            content_type_hdr = Some(mt.to_string());
        }

        found = true;
        while let Some(chunk) = field.next().await {
            match chunk {
                Ok(bytes) => file_bytes.extend_from_slice(&bytes),
                Err(e) => return HttpResponse::BadRequest().body(format!("Error reading file data: {e}")),
            }
        }
        break; // only first "file"
    }

    if !found {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Missing 'file' in upload"
        }));
    }

    // generate hex uid (like Python's uuid4().hex)
    let uid = Uuid::new_v4().simple().to_string();

    // build buck3t object URL (same base used in image.rs for buck3t)
    // e.g. {base}objects/uploads/{uid}.png
    let base = server_image();
    let url = format!("{}objects/uploads/{}.png", base, uid);

    // content-type: honor part or default
    let ct = content_type_hdr.unwrap_or_else(|| "application/octet-stream".to_string());

    // PUT to buck3t
    let put = client
        .put(url)
        .header("content-type", ct)
        .body(file_bytes.freeze())
        .send()
        .await;

    match put {
        Ok(resp) if resp.status().is_success() => {
            HttpResponse::Ok().json(serde_json::json!({
                "id": uid,
                "message": "Image uploaded successfully"
            }))
        }
        Ok(resp) => {
            let status = resp.status();
            let text = resp.text().await.unwrap_or_default();
            HttpResponse::BadGateway().body(format!("buck3t PUT failed: {status} {text}"))
        }
        Err(e) => HttpResponse::BadGateway().body(format!("buck3t PUT error: {e}")),
    }
}

// ---------- init ----------
// Choose handler at startup based on SERVER_MODE
pub(crate) fn init(cfg: &mut web::ServiceConfig) {
    if server_mode() == "buck3t" {
        cfg.route("/image/upload", web::post().to(upload_image_buck3t));
    } else {
        cfg.route("/image/upload", web::post().to(upload_image_proxy));
    }
}
