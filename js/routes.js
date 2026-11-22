import OpinionsHandlerMustache from "./opinionsHandlerMustache.js";

const PAGE_SIZE = 20;
const API_URL = "https://wt.kpi.fei.tuke.sk/api/article";

// objekt na prácu s názormi: formulár "opnFrm", výstup do "router-view", šablóna "template-opinions"
const opinionsHndlr = new OpinionsHandlerMustache("opnFrm", "router-view", "template-opinions");
opinionsHndlr.init();

// druhý objekt: názory na úvodnej stránke (div "welcome-opinions", šablóna "template-opinions-welcome")
const welcomeOpinionsHndlr = new OpinionsHandlerMustache("opnFrm", "welcome-opinions", "template-opinions-welcome");

const tmpl = id => document.getElementById(id).innerHTML;
const show = (targetElm, html) => { document.getElementById(targetElm).innerHTML = html; };

// pole trás: hash (časť za #), target (id elementu), getTemplate (funkcia)
export default [
    { hash: "welcome",  target: "router-view", getTemplate: createHtml4Welcome },
    { hash: "kontakt",  target: "router-view", getTemplate: t => show(t, tmpl("template-kontakt")) },
    { hash: "ochrana",  target: "router-view", getTemplate: t => show(t, tmpl("template-ochrana")) },
    { hash: "article",  target: "router-view", getTemplate: createHtml4Article },
    { hash: "opinions", target: "router-view", getTemplate: createHtml4opinions },
    { hash: "addOpinion", target: "router-view", getTemplate: createHtml4addOpinion },
    { hash: "articles", target: "router-view", getTemplate: fetchAndDisplayArticles }
];

// --- úvodná stránka: uvítanie + zoznam článkov + názory návštevníkov ---
function createHtml4Welcome(targetElm) {
    show(targetElm, tmpl("template-welcome"));
    welcomeOpinionsHndlr.showOpinions();
}

// --- vlastné články (#article/1 ... #article/6) ---
function createHtml4Article(targetElm, number) {
    const tpl = document.getElementById("template-article-" + parseInt(number));
    // článok sa zabalí do mriežky .rozlozenie (vľavo odkazy, v strede text, vpravo tip)
    show(targetElm, tpl ? `<div class="rozlozenie">${tpl.innerHTML}</div>` : tmpl("template-notfound"));
    // široké rozloženie len pre článok, inde zostáva pôvodná šírka
    document.getElementById(targetElm).classList.toggle("siroke", Boolean(tpl));
}

// --- názory návštevníkov ---
function createHtml4opinions() {
    opinionsHndlr.showOpinions();
}

// --- formulár ---
function createHtml4addOpinion(targetElm) {
    show(targetElm, tmpl("template-addOpinion"));
    opinionsHndlr.bindForm();
}

// --- články zo servera po stránkach (XMLHttpRequest) ---
function fetchAndDisplayArticles(targetElm, page) {
    page = Math.max(1, parseInt(page) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const url = `${API_URL}?max=${PAGE_SIZE}&offset=${offset}`;

    show(targetElm, '<p class="odsek">Načítavam články…</p>');

    function showError(message) {
        show(targetElm, Mustache.render(tmpl("template-articles-error"), { errMessage: message }));
    }

    const ajax = new XMLHttpRequest();

    ajax.addEventListener("load", function () {
        if (this.status !== 200) {
            showError(`Server odpovedal chybou ${this.status} (${this.statusText}).`);
            return;
        }
        let data;
        try {
            data = JSON.parse(this.responseText);
        } catch (e) {
            showError("Odpoveď servera sa nepodarilo spracovať.");
            return;
        }

        const articles = data.articles || [];
        const known = data.meta && Number.isFinite(data.meta.totalCount);
        const totalCount = known ? data.meta.totalCount : offset + articles.length;
        const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

        const view = { articles, currPage: page, pageCount, totalCount };
        if (page > 1) view.prevPage = page - 1;
        // ak server nevrátil totalCount, ďalšia strana je tam, keď je táto plná
        if (known ? page < pageCount : articles.length === PAGE_SIZE) view.nextPage = page + 1;

        show(targetElm, Mustache.render(tmpl("template-articles"), view));
    });

    ajax.addEventListener("error", () => showError("Server sa nepodarilo kontaktovať. Skontroluj pripojenie."));
    ajax.open("GET", url, true);
    ajax.send();
}
