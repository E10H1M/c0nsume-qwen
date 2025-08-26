// main.rs

use actix_files as fs;
use actix_web::{App, HttpServer, HttpResponse, web, Responder};
use actix_web::web::PayloadConfig;
use reqwest::Client;

// bring in your new modules
mod consts;
mod routes;
mod types;

// Health check
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Actix is running and serving your frontend.")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let host = "127.0.0.1";
    let port = 8080;

    // pull everything from consts.rs (which itself reads ENV with fallbacks)
    let server_route       = consts::server_route();
    let gen_image_base     = consts::server_generate_image();
    let gen_edit_base      = consts::server_generate_edit();
    let image_base         = consts::server_image();
    let upload_image_base  = consts::server_image_upload();
    let upload_base        = consts::server_upload();
    let mode               = consts::server_mode(); // <-- NEW

    println!("🚀 Actix server running at: http://{}:{}/", host, port);
    println!("⚙️  MODE         {}", mode); // <-- NEW
    println!("🔗 {:<12} {}", "route",        server_route);
    for (backend, url) in [
        ("gen_image",    gen_image_base.as_str()),
        ("gen_edit",     gen_edit_base.as_str()),
        ("image",        image_base.as_str()),
        ("upload_image", upload_image_base.as_str()),
        ("upload",       upload_base.as_str()),
    ] {
        println!("🔗 {:<12} {}", backend, url);
    }

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(Client::new()))
            .app_data(PayloadConfig::new(50 * 1024 * 1024))
            .service(fs::Files::new("/static", "./static").show_files_listing())
            .route("/", web::get().to(index))
            // wire the moved route(s)
            .configure(routes::generate::init)
            .configure(routes::image::init)
            .configure(routes::upload::init)
    })
    .bind((host, port))?
    .run()
    .await
}
