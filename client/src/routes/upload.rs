// routes/upload.rs

use actix_web::{web, HttpResponse, Responder, HttpRequest};
use actix_web::http::StatusCode as ActixStatusCode;
use reqwest::Client;

use crate::consts::{SERVER_IMAGE_UPLOAD, PATH_IMAGE_UPLOAD, join_base};

async fn upload_image(
    req: HttpRequest,
    payload: web::Bytes,
    client: web::Data<Client>,
) -> impl Responder {
    let mut builder = client.post(join_base(SERVER_IMAGE_UPLOAD, PATH_IMAGE_UPLOAD));

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

pub(crate) fn init(cfg: &mut web::ServiceConfig) {
    cfg.route("/image/upload", web::post().to(upload_image));
}
