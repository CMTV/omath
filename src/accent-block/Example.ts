import { Translator } from "../Translator";
import { Util } from "../util/Util";
import { ABV, SideBlock, XMLAccentBlock } from "./AccentBlock";

/**
 * <example id="foo" title="bar">
 *      Это обычный пример, которому даже не нужно отдельное решение.
 * </example>
 * 
 * <example>
 *      <task>Это условие примера или задачи.</task>
 *      <solution>Это подробное решение примера</solution>
 * </example>
 */

export class Example extends XMLAccentBlock
{
    type = 'example';
    id: string;
    parsedXml: any;
    
    title: string;
    task: string;
    solution: string;

    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.isExpandable = true;

        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: 'П',
            title: 'Пример'
        };

        abv.mainContentBlock.header = this.getLinkedHeader(this.title || 'Пример');
        abv.mainContentBlock.content = this.task;

        if (this.solution != null)
        {
            abv.sideBlocks.push({
                name: 'solution',
                content: `<i class="fas fa-chevron-down"></i>`,
                title: 'Решение'
            });

            abv.contentBlocks.push({
                name: 'solution',
                header: 'Решение',
                content: this.solution
            });
        }

        return abv;
    }

    parse(raw: string): this
    {
        let hasSolution = false;

        raw = raw.replace(Translator.tagRegexp('solution'), (match, start, inner, end) =>
        {
            hasSolution = true;
            return start + Util.wrapCDATA(inner) + end;
        });

        raw = Util.wrapTagCDATA((hasSolution ? 'task' : 'example'), raw);

        this.parsedXml = Util.parseXML(raw);

        this.id = this.parsedXml?.$?.id || null;
        this.title = this.parseTitle();

        if (!hasSolution)
        {
            this.task = this.parsedXml._;
            this.solution = null;
        }
        else
        {
            this.task = this.parsedXml.task[0]._;
            this.solution = this.parsedXml.solution[0]._;
        }

        this.task = Translator.renderSimple(this.task);
        this.solution = Translator.renderSimple(this.solution);

        return this;
    }
}