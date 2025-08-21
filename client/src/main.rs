use actix_files as fs;
use actix_web::{App, HttpServer, HttpResponse, HttpRequest, web, Responder};
use actix_web::http::StatusCode as ActixStatusCode;
use actix_web::web::PayloadConfig;
use serde::{Deserialize, Serialize};
use reqwest::Client;
type PromptRequest = serde_json::Value;


#[derive(Serialize, Deserialize)]
struct GenerateResponse {
    id: Option<String>,
    message: String,
}

// Health check
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Actix is running and serving your frontend.")
}

// Proxy POST /generate/image
async fn generate_image(
    json: web::Json<PromptRequest>,
    client: web::Data<Client>,
) -> impl Responder {
    let res = client
        .post("http://127.0.0.1:8000/generate/image")
        .json(&*json)
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



// Proxy POST /generate/edit
async fn generate_edit(
    json: web::Json<PromptRequest>,
    client: web::Data<Client>,
) -> impl Responder {
    let res = client
        .post("http://127.0.0.1:8000/generate/edit")
        .json(&*json)
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



// Proxy GET /image/{uid}
async fn fetch_image(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let url = format!("http://127.0.0.1:8000/image/{}", uid);

    match client.get(&url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
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



// Proxy POST /image/upload
async fn upload_image(
    req: HttpRequest,
    payload: web::Bytes,
    client: web::Data<Client>,
) -> impl Responder {
    let mut builder = client.post("http://127.0.0.1:8000/image/upload");

    // convert header to str before passing to reqwest
    if let Some(ct) = req.headers().get("content-type") {
        if let Ok(ct_str) = ct.to_str() {
            builder = builder.header("content-type", ct_str);
        }
    }

    let res = builder
        .body(payload.to_vec())
        .send()
        .await;

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



// Proxy GET /upload/{uid}
async fn fetch_upload(
    path: web::Path<String>,
    client: web::Data<Client>,
) -> impl Responder {
    let uid = path.into_inner();
    let url = format!("http://127.0.0.1:8000/upload/{}", uid);

    match client.get(&url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                let status = ActixStatusCode::from_u16(resp.status().as_u16())
                    .unwrap_or(ActixStatusCode::INTERNAL_SERVER_ERROR);
                return HttpResponse::build(status).body("Backend returned error");
            }
            match resp.bytes().await {
                Ok(bytes) => HttpResponse::Ok()
                    .content_type("image/png")
                    .body(bytes),
                Err(e) => HttpResponse::InternalServerError()
                    .body(format!("Error reading upload bytes: {e}")),
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

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(Client::new()))
            .app_data(PayloadConfig::new(50 * 1024 * 1024)) // allow up to 50MB uploads
            .service(fs::Files::new("/static", "./static").show_files_listing())
            .route("/", web::get().to(index))
            .route("/generate/image", web::post().to(generate_image))
            .route("/generate/edit", web::post().to(generate_edit))
            .route("/image/{uid}", web::get().to(fetch_image))
            .route("/image/upload", web::post().to(upload_image))
            .route("/upload/{uid}", web::get().to(fetch_upload))
    })
    .bind((host, port))?
    .run()
    .await
}
