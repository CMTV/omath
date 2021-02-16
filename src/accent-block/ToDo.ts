import { Translator } from "../Translator";
import { Util } from "../util/Util";
import { ABV, SideBlock, XMLAccentBlock } from "./AccentBlock";

/**
 * <todo>Доказать эту теорему другим способом!</todo>
 */
export class ToDo extends XMLAccentBlock
{
    type = 'todo';
    id: string = null;
    content: string;

    parse(raw: string): this
    {
        raw = Util.wrapTagCDATA(this.type, raw);

        this.parsedXml = Util.parseXML(raw);

        this.content = this.parsedXml?._ || null;

        return this;
    }

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: `<i class="fas fa-tools"></i>`,
            title: 'Ведутся работы!'
        };

        abv.mainContentBlock.header = `Работа в процессе!`;
        abv.mainContentBlock.content = Translator.renderSimple(this.content);

        return abv;
    }
}