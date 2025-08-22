// main.rs

use actix_files as fs;
use actix_web::{App, HttpServer, HttpResponse, web, Responder};
use actix_web::web::PayloadConfig;
use reqwest::Client;

// bring in your new modules
mod consts;
mod routes;
mod types;

// use the stuff you moved out
use crate::consts::*;

// Health check
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Actix is running and serving your frontend.")
}



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let host = "127.0.0.1";
    let port = 8080;

    println!("🚀 Actix server running at: http://{}:{}/", host, port);
    for (backend, url) in [
        ("gen_image",     SERVER_GENERATE_IMAGE),
        ("gen_edit",      SERVER_GENERATE_EDIT),
        ("image",         SERVER_IMAGE),
        ("upload_image",  SERVER_IMAGE_UPLOAD),
        ("upload",        SERVER_UPLOAD),
    ] {
        println!("🔗 {:<12} {}", backend, url);
    }

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(Client::new()))
            .app_data(PayloadConfig::new(50 * 1024 * 1024))
            .service(fs::Files::new("/static", "./static").show_files_listing())
            .route("/", web::get().to(index))
            // wire the moved route(s) from routes/generate.rs
            .configure(routes::generate::init)
            .configure(routes::image::init)
            .configure(routes::upload::init)
    })
    .bind((host, port))?
    .run()
    .await
}
