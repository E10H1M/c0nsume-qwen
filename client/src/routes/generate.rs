// routes/generate.rs

use actix_web::{web, HttpResponse, Responder};
use reqwest::Client;

use crate::types::{PromptRequest, GenerateResponse};
use crate::consts::{
    PATH_GENERATE_IMAGE, PATH_GENERATE_EDIT,
    join_base,
    server_generate_image, server_generate_edit,
};

// POST /generate/image
async fn generate_image(
    json: web::Json<PromptRequest>,
    client: web::Data<Client>,
) -> impl Responder {
    let base = server_generate_image();
    let url = join_base(&base, PATH_GENERATE_IMAGE);
    let res = client.post(url).json(&*json).send().await;

    match res {
        Ok(resp) => match resp.json::<GenerateResponse>().await {
            Ok(body) => HttpResponse::Ok().json(body),
            Err(_) => HttpResponse::InternalServerError().body("Invalid JSON from backend"),
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

// POST /generate/edit
async fn generate_edit(
    json: web::Json<PromptRequest>,
    client: web::Data<Client>,
) -> impl Responder {
    let base = server_generate_edit();
    let url = join_base(&base, PATH_GENERATE_EDIT);
    let res = client.post(url).json(&*json).send().await;

    match res {
        Ok(resp) => match resp.json::<GenerateResponse>().await {
            Ok(body) => HttpResponse::Ok().json(body),
            Err(_) => HttpResponse::InternalServerError().body("Invalid JSON from backend"),
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}

pub(crate) fn init(cfg: &mut web::ServiceConfig) {
    // keep absolute paths to avoid changing behavior
    cfg.route("/generate/image", web::post().to(generate_image))
       .route("/generate/edit",  web::post().to(generate_edit));
}
