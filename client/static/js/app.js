// static/js/app.js
import { createMenuBar } from "/static/js/menubar.js";
import { createSidebar, addToHistory } from "/static/js/sidebar.js";
import { createImageGenerator } from "/static/js/imageGenerator.js";

// mount global components
document.getElementById("sidebar-root").appendChild(createSidebar());
document.getElementById("menubar-root").appendChild(createMenuBar());

const imageGen = createImageGenerator();
document.getElementById("image-generator-root").appendChild(imageGen);

// 🔥 Wire image generator → history sidebar
imageGen.addEventListener("imageGenerated", (e) => {
  addToHistory(e.detail.id);
});
