
export default class OpinionsHandler {

    /**
     * @param {string} opinionsFormElmId
     * @param {string} opinionsListElmId
     * @param {string} storageKey
     */
    constructor(opinionsFormElmId, opinionsListElmId, storageKey = "kolesoComments") {
        this.opinionsFormElmId = opinionsFormElmId;
        this.opinionsListElmId = opinionsListElmId;
        this.storageKey = storageKey;
        this.opinions = [];
    }


    get opinionsElm() {
        return document.getElementById(this.opinionsListElmId);
    }

    init() {
        this.opinions = this.loadOpinions();
    }

    // ---------- localStorage ----------

    loadOpinions() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Uložené názory sa nepodarilo načítať:", e);
            return [];
        }
    }

    saveOpinions() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.opinions));
    }

    // ---------- zobrazenie ----------

    showOpinions() {
        this.opinions = this.loadOpinions();
        const elm = this.opinionsElm;
        if (elm) {
            elm.innerHTML = this.opinionArray2html(this.opinions);
        }
    }

    opinion2view(opinion) {
        return {
            name: opinion.name,
            email: opinion.email,
            image: opinion.image,
            keyword: opinion.keyword,
            drive: opinion.drive,
            comment: opinion.comment,
            createdDate: new Date(opinion.created).toLocaleDateString("sk-SK"),
            willReturnMessage: opinion.willReturn
                ? "Určite sa na blog ešte vrátim."
                : "Zatiaľ sa vracať neplánujem."
        };
    }

    escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }


    opinion2html(opinion) {
        const v = this.opinion2view(opinion);
        const e = text => this.escapeHtml(text);

        return `
        <section class="nazor">
            <h2>${e(v.name)} <i>${e(v.createdDate)}</i></h2>
            ${v.image ? `<img src="${e(v.image)}" alt="Auto od ${e(v.name)}" loading="lazy">` : ""}
            <p>${e(v.comment)}</p>
            ${v.email ? `<p class="meta">E-mail: <a href="mailto:${e(v.email)}">${e(v.email)}</a></p>` : ""}
            <p class="meta">Pohon: ${e(v.drive)}${v.keyword ? ` · Kľúčové slovo: ${e(v.keyword)}` : ""}</p>
            <p class="meta">${e(v.willReturnMessage)}</p>
        </section>`;
    }


    opinionArray2html(sourceData) {
        const list = sourceData.reduce((html, opn) => html + this.opinion2html(opn), "");
        const empty = `<p class="odsek">Zatiaľ tu nie sú žiadne názory. <a href="#addOpinion">Buď prvý!</a></p>`;

        return `<h1>Názory návštevníkov</h1>${list || empty}`;
    }

    // ---------- formulár ----------


    bindForm() {
        const form = document.getElementById(this.opinionsFormElmId);
        form.addEventListener("submit", event => this.processOpnFrmData(event));
    }


    processOpnFrmData(event) {
        event.preventDefault();
        const f = event.target;

        const newOpinion = {
            name: f.elements["meno"].value.trim(),
            email: f.elements["email"].value.trim(),
            image: f.elements["obrazok"].value.trim(),
            keyword: f.elements["kluc"].value.trim(),
            drive: f.elements["pohon"].value,
            comment: f.elements["komentar"].value.trim(),
            willReturn: f.elements["vratim"].checked,
            created: new Date()
        };

        this.opinions = this.loadOpinions();
        this.opinions.push(newOpinion);
        this.saveOpinions();

        window.location.hash = "opinions";
    }
}
