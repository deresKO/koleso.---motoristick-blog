
import OpinionsHandler from "./opinionsHandler.js";

export default class OpinionsHandlerMustache extends OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId, templateElmId) {
        super(opinionsFormElmId, opinionsListElmId);

        this.mustacheTemplate = document.getElementById(templateElmId).innerHTML;
    }

    
    opinionArray2html(sourceData) {
        const views = sourceData.map(opinion => this.opinion2view(opinion));

        return Mustache.render(this.mustacheTemplate, views);
    }
}
