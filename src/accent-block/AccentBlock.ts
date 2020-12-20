import { PugWrapper } from "../site/PugWrapper";

export interface SideBlock
{
    name: string;
    content: string;
    title: string;
}

export interface ContentBlock
{
    name: string;
    content: string;
    header?: string;
}

interface AccentBlockView
{
    type: string;
    id: string;
    mainSideBlock: SideBlock;
    mainContentBlock: ContentBlock;
}

export class AccentBlock
{
    static compile(view: ABV)
    {
        return PugWrapper.render(`components/accent-block`, view);
    }
}

export abstract class XMLAccentBlock
{
    abstract type: string;
    id: string;
    parsedXml: any;

    abstract parse(raw: string): this;
    abstract toAccentBlock(): ABV;

    outId()
    {
        if (this.id == null)
            return null;
        
        return this.type + '_' + this.id;
    }

    getCasualABV(): ABV
    {
        let abv = new ABV();

        abv.type = this.type;
        abv.id = this.outId();

        return abv;
    }

    parseTitle()
    {
        let title = this.parsedXml?.$?.title;

        if (title == null) return null;
        else return title.trim();
    }

    getLinkedHeader(title: string)
    {
        if (this.id == null)
            return title;
        
        return `<a href="#${this.outId()}">${title}</a>`;
    }
}

export class ABV implements AccentBlockView
{
    isExpandable = false;
    
    type: string;
    id: string;
    mainSideBlock: SideBlock = <SideBlock> { name: 'main' };
    mainContentBlock = <ContentBlock> { name: 'main' };
    
    sideBlocks: SideBlock[] = [];
    contentBlocks: ContentBlock[] = [];
}