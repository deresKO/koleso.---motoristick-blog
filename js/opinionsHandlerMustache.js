/*
 * Trieda OpinionsHandlerMustache je potomkom OpinionsHandler. Líši sa tým, že HTML názorov
 * vyrába zo šablóny systému Mustache (element script s id templateElmId v index.html)
 * namiesto šablónových literálov. Knižnica Mustache sa načítava v index.html (js/mustache.min.js).
 */
import OpinionsHandler from "./opinionsHandler.js";

export default class OpinionsHandlerMustache extends OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId, templateElmId) {
        // konštruktor nadtriedy:
        super(opinionsFormElmId, opinionsListElmId);

        // text Mustache šablóny:
        this.mustacheTemplate = document.getElementById(templateElmId).innerHTML;
    }

    /** Šablóna s id=template-opinions obsahuje celú stránku, preto sa prepisuje celé pole. */
    opinionArray2html(sourceData) {
        // Mustache šablóny sú bez logiky, údaje na zobrazenie sa pripravia vopred:
        const views = sourceData.map(opinion => this.opinion2view(opinion));

        return Mustache.render(this.mustacheTemplate, views);
    }
}
