// consts.rs

// backends
pub(crate) const SERVER_ROUTE: &str = "http://127.0.0.1:8000/";
pub(crate) const SERVER_GENERATE_IMAGE: &str = SERVER_ROUTE;
pub(crate) const SERVER_GENERATE_EDIT:  &str = SERVER_ROUTE;
pub(crate) const SERVER_IMAGE:          &str = SERVER_ROUTE;
pub(crate) const SERVER_IMAGE_UPLOAD:   &str = SERVER_ROUTE;
pub(crate) const SERVER_UPLOAD:         &str = SERVER_ROUTE;

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
