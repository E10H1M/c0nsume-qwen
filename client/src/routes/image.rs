// routes/image.rs

use actix_web::{web, HttpResponse, Responder};
use actix_web::http::StatusCode as ActixStatusCode;
use reqwest::Client;

use crate::consts::{
    PATH_IMAGE, PATH_UPLOAD,
    join_base,
    server_image, server_upload,
    server_mode,
};

// ---------- helpers ----------

fn pass_through_ct_or_default(resp: &reqwest::Response, default_ct: &str) -> String {
    resp.headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .unwrap_or(default_ct)
        .to_string()
}

// ---------- /image/{uid} ----------

// LOCAL → proxy to python image server
async fn fetch_image_local(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let base = server_image();
    let url = join_base(&base, &format!("{PATH_IMAGE}{uid}"));

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            let ct = pass_through_ct_or_default(&resp, "image/png");
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type(ct).body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading image bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// BUCK3T → direct to bucket: /objects/output/{uid}.png?download=0
async fn fetch_image_buck3t(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let base = server_image();
    let url = format!("{}objects/output/{uid}.png?download=0", base);

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            let ct = pass_through_ct_or_default(&resp, "image/png");
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type(ct).body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading image bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// ---------- /upload/{uid} ----------

// LOCAL → proxy to python upload server
async fn fetch_upload_local(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let base = server_upload();
    let url = join_base(&base, &format!("{PATH_UPLOAD}{uid}"));

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            let ct = pass_through_ct_or_default(&resp, "image/png");
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type(ct).body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading upload bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// BUCK3T → direct to bucket: /objects/uploads/{uid}.png?download=0
async fn fetch_upload_buck3t(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let base = server_image(); // same base as other buck3t calls
    let url = format!("{}objects/uploads/{uid}.png?download=0", base);

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            let ct = pass_through_ct_or_default(&resp, "image/png");
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type(ct).body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading upload bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// ---------- init ----------
// Choose handlers at startup based on SERVER_MODE
pub(crate) fn init(cfg: &mut web::ServiceConfig) {
    if server_mode() == "buck3t" {
        cfg.route("/image/{uid}", web::get().to(fetch_image_buck3t))
          .route("/upload/{uid}", web::get().to(fetch_upload_buck3t));
    } else {
        cfg.route("/image/{uid}", web::get().to(fetch_image_local))
          .route("/upload/{uid}", web::get().to(fetch_upload_local));
    }
}
