import { Index, IndexItemType } from "./Index";
import { ABV, SideBlock } from "../accent-block/AccentBlock";
import { Translator } from "../Translator";
import { Util } from "../util/Util";
import { IndexSubject } from "./IndexSubject";

/**
 * <theorem id="foo" title="bar">
 *      Это теорема, которая состоит только из утверждения
 * </theorem>
 * 
 * <theorem>
 *      <statement>Это утверждение теоремы</statement>
 *      <proof>Это доказательство теоремы</proof>
 * </theorem>
 */

export class Theorem extends IndexSubject
{
    type = IndexItemType.Theorem;
    
    title: string;
    statement: string;
    proof: string;

    canAddToIndex()
    {
        return super.canAddToIndex() && (this.title !== null);
    }

    addToIndex(index: Index)
    {        
        index.add(this.type, this.title, this.outId());
    }

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.isExpandable = true;

        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: 'Т',
            title: 'Теорема'
        };

        abv.mainContentBlock.header = this.getLinkedHeader(this.title || 'Теорема');
        abv.mainContentBlock.content = this.statement;

        if (this.proof !== null)
        {
            abv.sideBlocks.push({
                name: 'proof',
                content: `<i class="fas fa-chevron-down"></i>`,
                title: 'Доказательство'
            });

            abv.contentBlocks.push({
                name: 'proof',
                header: 'Доказательство',
                content: this.proof
            });
        }

        return abv;
    }

    parse(raw: string)
    {        
        let hasProof = false;

        raw = raw.replace(Translator.tagRegexp('proof'), (match, start, inner, end) =>
        {
            hasProof = true;
            return start + Util.wrapCDATA(inner) + end;
        });

        raw = Util.wrapTagCDATA((hasProof ? 'statement' : 'theorem'), raw);

        this.parsedXml = Util.parseXML(raw);

        this.id = this.parsedXml?.$?.id || null;
        this.title = this.parseTitle();

        if (!hasProof)
        {
            this.statement = this.parsedXml._;
            this.proof = null;
        }
        else
        {
            this.statement = this.parsedXml.statement[0]._;
            this.proof = this.parsedXml.proof[0]._;
        }

        this.statement = Translator.renderSimple(this.statement);
        this.proof = Translator.renderSimple(this.proof);

        return this;
    }
}