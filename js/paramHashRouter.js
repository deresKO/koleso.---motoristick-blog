
export default class ParamHashRouter {
    constructor(routes, inithash) {
        this.routes = routes;

        window.addEventListener("hashchange", () => this.doRouting());

        if (!window.location.hash) {
            window.location.hash = inithash;
        } else {
            this.doRouting();
        }
    }

    doRouting() {
        let hash = window.location.hash;
        if (!hash) return;

        hash = hash[0] === "#" ? hash.substring(1) : hash;
        const hashParts = hash.split("/");
        const matchingRoute = this.routes.find(route => route.hash === hashParts[0]);

        document.getElementById("router-view").classList.remove("siroke");

        if (matchingRoute) {
            hashParts.shift();
            matchingRoute.getTemplate(matchingRoute.target, ...hashParts);
        } else {
            document.getElementById("router-view").innerHTML =
                document.getElementById("template-notfound").innerHTML;
        }
    }
}
