// /static/js/sidebar.js

// import sidebar.css dynamically
(function loadSidebarCSS() {
  if (!document.querySelector('link[href="/static/css/sidebar.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/static/css/sidebar.css";
    document.head.appendChild(link);
  }
})();

export function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";
  sidebar.className = "sidebar";

  // close button
  const closeBtn = document.createElement("button");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // title
  const title = document.createElement("h2");
  title.textContent = "History";

  // history list
  const list = document.createElement("ul");
  list.id = "history-list";
  const empty = document.createElement("li");
  empty.textContent = "No images yet";
  list.appendChild(empty);

  sidebar.appendChild(closeBtn);
  sidebar.appendChild(title);
  sidebar.appendChild(list);

  // modal (hidden by default)
  const modal = document.createElement("div");
  modal.id = "image-modal";
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="image-modal-content">
      <span class="modal-close">&times;</span>
      <img id="modal-img" src="" alt="Enlarged">
    </div>
  `;
  document.body.appendChild(modal);

  // close modal with ✕
  modal.querySelector(".modal-close").onclick = () => {
    modal.style.display = "none";
  };

  // 🔹 close modal when clicking background
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  return sidebar;
}

export function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
}

export function addToHistory(imageId) {
  const list = document.getElementById("history-list");
  if (!list) return;

  // remove placeholder
  const empty = list.querySelector("li");
  if (empty && empty.textContent === "No images yet") {
    empty.remove();
  }

  const item = document.createElement("li");
  const img = document.createElement("img");
  img.src = `/image/${imageId}`;
  img.alt = `Generated ${imageId}`;
  img.className = "history-thumb";

  // 👇 open modal when clicked
  img.addEventListener("click", () => {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    modalImg.src = img.src;
    modal.style.display = "flex";
  });

  item.appendChild(img);
  list.appendChild(item);
}
