import { Util } from "../util/Util";
import { ABV, SideBlock, XMLAccentBlock } from "./AccentBlock";

/**
 * <dodem id="I.1/abs" title="Модуль" />
 */

export class Dodem extends XMLAccentBlock
{
    type = 'dodem';
    id: string = null;
    tocId: string;
    title: string;

    parse(raw: string): this
    {
        raw = Util.wrapTagCDATA(this.type, raw);

        this.parsedXml = Util.parseXML(raw);

        this.tocId = this.parsedXml?.$?.id || null;
        this.title = this.parsedXml?.$?.title || null;
        
        return this;
    }
    
    toAccentBlock(): ABV
    {
        let abv = this.getCasualABV();

        abv.mainSideBlock = <SideBlock> {
            name: 'type',
            content: 'Д',
            title: 'Демидович'
        };

        abv.mainContentBlock.content = `Теперь у вас есть вся необходимая информация для решения задач из раздела <a target="_blank" href="https://dodem.ru/toc/${this.tocId}">${this.title}</a>.\nЗакрепите пройденную теорию практикой!`;

        return abv;
    }
}