import { Util } from "../util/Util";
import { ABV, SideBlock, XMLAccentBlock } from "./AccentBlock";

/**
 * <cross title="Обратное отношение" />
 */
export class CrossTheme extends XMLAccentBlock
{
    type = 'cross';
    id: string = null;
    articleId: string;
    title: string;

    parse(raw: string): this
    {
        raw = Util.wrapTagCDATA(this.type, raw);

        this.parsedXml = Util.parseXML(raw);

        this.articleId = this.parsedXml?.$?.id || null;
        this.title = this.parsedXml?.$?.title || null;

        return this;
    }

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: `<i class="fas fa-random"></i>`,
            title: 'Пересечение тем'
        };

        abv.mainContentBlock.content = `Содержимое этого раздела пересекается со статьей «<a target="_blank" href="https://omath.ru/${this.articleId}">${this.title}</a>».\nВозможно (но не факт), что для полного понимания вам потребуется ознакомится и с ней тоже.`;

        return abv;
    }
}