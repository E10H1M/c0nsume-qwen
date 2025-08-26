// consts.rs
use std::env;

// load from .env lazily on every read (no once_cell)
#[inline]
fn get_var(name: &str) -> Option<String> {
    let _ = dotenvy::dotenv();
    env::var(name).ok()
}

#[inline]
fn with_trailing_slash(mut s: String) -> String {
    if !s.ends_with('/') { s.push('/'); }
    s
}

// backends (ENV with fallback)
pub(crate) fn server_route() -> String {
    with_trailing_slash(
        get_var("SERVER_ROUTE")
            .unwrap_or_else(|| "http://127.0.0.1:8000/".to_string()),
    )
}

pub(crate) fn server_generate_image() -> String {
    with_trailing_slash(get_var("SERVER_GENERATE_IMAGE").unwrap_or_else(server_route))
}

pub(crate) fn server_generate_edit() -> String {
    with_trailing_slash(get_var("SERVER_GENERATE_EDIT").unwrap_or_else(server_route))
}

pub(crate) fn server_image() -> String {
    with_trailing_slash(get_var("SERVER_IMAGE").unwrap_or_else(server_route))
}

pub(crate) fn server_image_upload() -> String {
    with_trailing_slash(get_var("SERVER_IMAGE_UPLOAD").unwrap_or_else(server_route))
}

pub(crate) fn server_upload() -> String {
    with_trailing_slash(get_var("SERVER_UPLOAD").unwrap_or_else(server_route))
}

// paths
pub(crate) const PATH_GENERATE_IMAGE: &str = "generate/image";
pub(crate) const PATH_GENERATE_EDIT:  &str = "generate/edit";
pub(crate) const PATH_IMAGE:          &str = "image/";
pub(crate) const PATH_IMAGE_UPLOAD:   &str = "image/upload";
pub(crate) const PATH_UPLOAD:         &str = "upload/";

// tiny helper
pub(crate) fn join_base(base: &str, path: &str) -> String {
    if base.ends_with('/') { format!("{base}{path}") } else { format!("{base}/{path}") }
}


// mode
pub(crate) fn server_mode() -> String {
    get_var("MODE").unwrap_or_else(|| "local".to_string())
}