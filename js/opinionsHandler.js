/*
 * Trieda OpinionsHandler: načítanie, uloženie a zobrazenie názorov návštevníkov.
 * Údaje sa ukladajú do window.localStorage, HTML sa vyrába pomocou šablónových literálov
 * (template literals). Potomok OpinionsHandlerMustache používa namiesto nich šablónu Mustache.
 */
export default class OpinionsHandler {

    /**
     * @param {string} opinionsFormElmId  id formulára pre nový názor (vkladá sa až po prechode na trasu)
     * @param {string} opinionsListElmId  id elementu, do ktorého sa vykresľujú názory
     * @param {string} storageKey         kľúč v localStorage
     */
    constructor(opinionsFormElmId, opinionsListElmId, storageKey = "kolesoComments") {
        this.opinionsFormElmId = opinionsFormElmId;
        this.opinionsListElmId = opinionsListElmId;
        this.storageKey = storageKey;
        this.opinions = [];
    }

    /**
     * Cieľový element sa hľadá až pri použití, lebo ho router do stránky vkladá dynamicky
     * (napr. #welcome-opinions vzniká až po zobrazení úvodnej stránky).
     */
    get opinionsElm() {
        return document.getElementById(this.opinionsListElmId);
    }

    /** Načíta uložené názory do poľa opinions. */
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

    /** Vykreslí všetky názory do cieľového elementu. */
    showOpinions() {
        this.opinions = this.loadOpinions();
        const elm = this.opinionsElm;
        if (elm) {
            elm.innerHTML = this.opinionArray2html(this.opinions);
        }
    }

    /** Údaje určené len na zobrazenie; pôvodný objekt sa nemení. */
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

    /** Ochrana pred vložením HTML z formulára (šablónové literály nič neescapujú). */
    escapeHtml(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /** HTML jedného názoru (šablónový literál). */
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

    /** HTML celej stránky s názormi (nadpis + zoznam, prípadne hláška o prázdnom zozname). */
    opinionArray2html(sourceData) {
        const list = sourceData.reduce((html, opn) => html + this.opinion2html(opn), "");
        const empty = `<p class="odsek">Zatiaľ tu nie sú žiadne názory. <a href="#addOpinion">Buď prvý!</a></p>`;

        return `<h1>Názory návštevníkov</h1>${list || empty}`;
    }

    // ---------- formulár ----------

    /** Pripojí spracovanie odoslania na formulár, ktorý je práve vložený do stránky. */
    bindForm() {
        const form = document.getElementById(this.opinionsFormElmId);
        form.addEventListener("submit", event => this.processOpnFrmData(event));
    }

    /** Prečíta údaje z formulára, uloží ich do poľa opinions a do localStorage. */
    processOpnFrmData(event) {
        event.preventDefault();
        const f = event.target;

        const newOpinion = {
            name: f.elements["meno"].value.trim(),
            email: f.elements["email"].value.trim(),
            image: f.elements["obrazok"].value.trim(),
            keyword: f.elements["kluc"].value.trim(),
            drive: f.elements["pohon"].value,          // radio skupina = jedna položka
            comment: f.elements["komentar"].value.trim(),
            willReturn: f.elements["vratim"].checked,
            created: new Date()
        };

        this.opinions = this.loadOpinions();
        this.opinions.push(newOpinion);
        this.saveOpinions();

        window.location.hash = "opinions";             // po odoslaní prejdi na zoznam názorov
    }
}
