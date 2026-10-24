import OpinionsHandler from "./opinionsHandler.js";
// Knižnicu si neskôr stiahni do js/mustache.js a zmeň cestu na "./mustache.js"
import Mustache from "https://cdn.jsdelivr.net/npm/mustache@4.2.0/mustache.mjs";

export default class OpinionsHandlerMustache extends OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId, templateElmId) {
        super(opinionsFormElmId, opinionsListElmId);
        this.mustacheTemplate = document.getElementById(templateElmId).innerHTML;
    }

    // Mustache automaticky escapuje HTML, takže vložený kód sa nevykoná
    opinion2html(opinion) {
        return Mustache.render(this.mustacheTemplate, this.toView(opinion));
    }
}
