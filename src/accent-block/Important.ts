import { Translator } from "../Translator";
import { Util } from "../util/Util";
import { ABV, SideBlock, XMLAccentBlock } from "./AccentBlock";

/**
 * <important>Какие-то очень важные заметки</important>
 */

export class Important extends XMLAccentBlock
{
    type = 'important';
    content: string;

    parse(raw: string): this
    {
        raw = Util.wrapTagCDATA(this.type, raw);
        this.parsedXml = Util.parseXML(raw);
        this.content = Translator.renderSimple(this.parsedXml._);

        return this;
    }

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.mainSideBlock = <SideBlock> {
            name: 'important',
            content: '<i class="fas fa-exclamation"></i>',
            title: 'Важно'
        };

        abv.mainContentBlock.content = this.content;

        return abv;
    }
}