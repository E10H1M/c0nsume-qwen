use actix_files as fs;
use actix_web::{App, HttpServer, HttpResponse, web, Responder};
use actix_web::http::StatusCode as ActixStatusCode;
use serde::{Deserialize, Serialize};
use reqwest::Client;

// Data structs for JSON
// #[derive(Serialize, Deserialize)]
type PromptRequest = serde_json::Value;


#[derive(Serialize, Deserialize)]
struct GenerateResponse {
    id: Option<String>,   // optional if backend doesn’t always return it
    message: String,
}

// Health check route
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Actix is running and serving your frontend.")
}

// Proxy route: send JSON to backend
async fn generate(
    json: web::Json<PromptRequest>,
    client: web::Data<Client>,
) -> impl Responder {
    let res = client
        .post("http://127.0.0.1:8000/generate")
        .json(&*json)              // forwards prompt, aspect_ratio, cfg, seed, etc.
        .send()
        .await;

    match res {
        Ok(resp) => match resp.json::<GenerateResponse>().await {
            Ok(body) => HttpResponse::Ok().json(body),
            Err(_) => HttpResponse::InternalServerError().body("Invalid JSON from backend"),
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}


// Proxy GET /image/{uid} to backend
async fn fetch_image(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let url = format!("http://127.0.0.1:8000/image/{}", uid);

    match client.get(&url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                // 🔑 convert reqwest::StatusCode -> actix_web::http::StatusCode
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);

                return HttpResponse::build(status).body("Backend returned error");
            }
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok()
                    .content_type("image/png")
                    .body(bytes),
                Err(e) => HttpResponse::InternalServerError()
                    .body(format!("Error reading image bytes: {e}")),
            }
        }
        Err(e) => HttpResponse::InternalServerError().body(format!("Request failed: {e}")),
    }
}



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let host = "127.0.0.1";
    let port = 8080;

    println!("🚀 Actix server running at: http://{}:{}/", host, port);
    println!("👉 Static files: http://{}:{}/static/index.html", host, port);

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(Client::new()))
            .service(fs::Files::new("/static", "./static").show_files_listing())
            .route("/", web::get().to(index))
            .route("/generate", web::post().to(generate))
            .route("/image/{uid}", web::get().to(fetch_image))
    })
    .bind((host, port))?
    .run()
    .await
}
