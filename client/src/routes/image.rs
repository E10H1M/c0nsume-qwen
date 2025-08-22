// routes/image.rs

use actix_web::{web, HttpResponse, Responder};
use actix_web::http::StatusCode as ActixStatusCode;
use reqwest::Client;

use crate::consts::{SERVER_IMAGE, SERVER_UPLOAD, PATH_IMAGE, PATH_UPLOAD, join_base};

async fn fetch_image(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let url = join_base(SERVER_IMAGE, &format!("{PATH_IMAGE}{uid}"));

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type("image/png").body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading image bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

async fn fetch_upload(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let url = join_base(SERVER_UPLOAD, &format!("{PATH_UPLOAD}{uid}"));

    match client.get(url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok().content_type("image/png").body(bytes),
                Err(e) => HttpResponse::InternalServerError().body(format!("Error reading upload bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

pub(crate) fn init(cfg: &mut web::ServiceConfig) {
    cfg.route("/image/{uid}", web::get().to(fetch_image))
       .route("/upload/{uid}", web::get().to(fetch_upload));
}
