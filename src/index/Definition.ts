import { Translator } from "../Translator";
import { IndexSubject } from "./IndexSubject";
import { Index, IndexItemType } from ".";
import { ABV, SideBlock } from "../accent-block/AccentBlock";
import { Util } from "../util/Util";

/**
 * <definition id="foo">
 *      Это <def>определение</def>. Больше ничего не надо!
 * </definition>
 */

export class Definition extends IndexSubject
{
    type = IndexItemType.Definition;
    defs: string[] = [];
    content: string;

    canAddToIndex()
    {
        return super.canAddToIndex() && (this.defs.length !== 0);
    }

    addToIndex(index: Index)
    {
        this.defs.forEach(defTerm => { index.add(this.type, defTerm, this.outId()); });
    }

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();
        
        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: 'О',
            title: 'Определение'
        };

        abv.mainContentBlock.content = this.content;

        return abv;
    }

    parse(raw: string)
    {
        raw = Util.wrapTagCDATA(this.type, raw);
        
        this.parsedXml = Util.parseXML(raw);

        this.id = this.parsedXml?.$?.id || null;

        this.content = this.parsedXml._;
        this.content = this.content.replace(/<def>(.+?)<\/def>/gm, (match, defText) =>
        {
            this.defs.push(defText);
            return `<a ${(this.id !== null ? `href="#${this.outId()}"` : '')} class="definition">${defText}</a>`;
        });

        this.content = Translator.renderSimple(this.content);

        return this;
    }
}