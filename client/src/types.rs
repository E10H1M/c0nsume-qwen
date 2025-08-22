// types.rs

use serde::{Deserialize, Serialize};

pub type PromptRequest = serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct GenerateResponse {
    pub id: Option<String>,
    pub message: String,
}
