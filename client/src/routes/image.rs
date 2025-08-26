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

async fn fetch_image(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let mode = server_mode();

    let url = if mode == "buck3t" {
        // direct to bucket using SERVER_IMAGE as base
        let base = server_image(); 
        format!("{}objects/output/{uid}.png?download=0", base)
    } else {
        // local → unchanged
        let base = server_image();
        join_base(&base, &format!("{PATH_IMAGE}{uid}"))
    };

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
    let base = server_upload();
    let url = join_base(&base, &format!("{PATH_UPLOAD}{uid}"));

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
