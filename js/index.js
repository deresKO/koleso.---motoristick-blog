import Router from "./paramHashRouter.js";
import Routes from "./routes.js";
import "./engine.js";

window.router = new Router(Routes, "welcome");

// Po prechode na inú trasu zavri menu a skoč na začiatok stránky
window.addEventListener("hashchange", () => {
    document.getElementById("menu-check").checked = false;
    document.getElementById("rozbal-check").checked = false;
    window.scrollTo(0, 0);
});
