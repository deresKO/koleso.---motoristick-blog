// Spracovanie formulára s názormi: localStorage + zobrazenie (šablónové literály)
export default class OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId) {
        this.opinions = [];
        this.opinionsElm = document.getElementById(opinionsListElmId);
        this.opinionsFrmElm = document.getElementById(opinionsFormElmId);
    }

    init() {
        try {
            const stored = localStorage.kolesoComments;
            if (stored) this.opinions = JSON.parse(stored);
        } catch (e) {
            console.error("Uložené názory sa nepodarilo načítať:", e);
            this.opinions = [];
        }

        this.opinionsElm.innerHTML = this.opinionArray2html(this.opinions);
        this.opinionsFrmElm.addEventListener("submit", event => this.processOpnFrmData(event));
    }

    processOpnFrmData(event) {
        event.preventDefault();
        const f = this.opinionsFrmElm;

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

        this.opinions.push(newOpinion);
        localStorage.kolesoComments = JSON.stringify(this.opinions);

        this.opinionsElm.insertAdjacentHTML("beforeend", this.opinion2html(newOpinion));
        f.reset();
    }

    // Spoločné pomocné údaje pre zobrazenie (pôvodný objekt sa nemení)
    toView(opinion) {
        return {
            name: opinion.name,
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

    // Šablónový literál. POZOR: neescapuje HTML (na rozdiel od Mustache).
    opinion2html(opinion) {
        const v = this.toView(opinion);
        return `
            <section class="nazor">
                <h3>${v.name} <i>${v.createdDate}</i></h3>
                ${v.image ? `<img src="${v.image}" alt="Auto od ${v.name}" loading="lazy">` : ""}
                <p>${v.comment}</p>
                <p class="meta">Pohon: ${v.drive}${v.keyword ? ` · Kľúčové slovo: ${v.keyword}` : ""}</p>
                <p class="meta">${v.willReturnMessage}</p>
            </section>`;
    }

    opinionArray2html(sourceData) {
        if (sourceData.length === 0) {
            return `<p class="odsek">Zatiaľ tu nie sú žiadne názory. Buď prvý!</p>`;
        }
        return sourceData.reduce((html, opn) => html + this.opinion2html(opn), "");
    }
}
