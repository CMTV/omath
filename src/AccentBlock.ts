import { EOL } from "os";
import { INDEX, IndexItemType } from "./Index";
import { Translator } from "./Translator";

interface SideBlock
{
    name: string;
    content: string;
    title: string;
}

interface ContentBlock
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

//
//
//

interface AB_SubBlock_Header
{
    name: string;
    id: string;
    text: string;
}

interface AB_SubBlock
{
    header: AB_SubBlock_Header;
    body: string;
}

export class AB_Parser
{
    static parse(blockStr: string): ABV
    {
        let type: string = null;
        let subBlocks: AB_SubBlock[] = [];

        let subBlocksRaw = blockStr.split('|||');
        subBlocksRaw.shift(); subBlocksRaw.pop();

        subBlocksRaw.forEach((subBlockRaw, i) =>
        {
            let splitted = subBlockRaw.split(EOL);
            let header = AB_Parser.parseHeader(splitted.shift());
            let body = Translator.renderSimple(splitted.join(EOL));

            if (i === 0)
                type = header.name;
            
            subBlocks.push({ header: header, body: body });
        });

        return AB_Parser.getView(type, subBlocks);
    }

    static parseHeader(header: string): AB_SubBlock_Header
    {
        let headerParts = header.trim().split(' ');
        let name = headerParts.shift();
        let id = null;
        let text = null;

        for (let i = 0; i < headerParts.length; i++)
        {
            if (headerParts[i][0] === '#')
            {
                id = headerParts[i].substring(1);
                headerParts.splice(i, 1);
                break;
            }
        }
        
        text = headerParts.join(' ').trim();
        if (text === '')
            text = null;

        return <AB_SubBlock_Header> {
            name: name,
            id: id,
            text: text
        }
    }

    static getView(type: string, subBlocks: AB_SubBlock[]): ABV
    {
        switch (type)
        {
            case AccentBlockType.Definition:    return new ABV_Definition(subBlocks);
            case AccentBlockType.Theorem:       return new ABV_Theorem(subBlocks);
            case AccentBlockType.Example:       return new ABV_Example(subBlocks);

            default:
                throw new Error(`Unknown accent block type: '${type}'!`);
        }
    }
}

//
//
//

enum AccentBlockType
{
    Definition = 'definition',
    Theorem = 'theorem',
    Example = 'example',
    Quote = 'quote'
}

export abstract class ABV implements AccentBlockView
{
    type: string;
    id: string;
    mainSideBlock: SideBlock;
    mainContentBlock = <ContentBlock> { name: 'main' };
    
    sideBlocks: SideBlock[] = [];
    contentBlocks: ContentBlock[] = [];

    constructor(type: string, subBlocks: AB_SubBlock[])
    {
        this.type = type;

        let mainSubBlock = subBlocks[0];
        let id = mainSubBlock.header.id;

        if (id === null)
            this.id = null;
        else
            this.id = type + '_' + id;
    }
}

class ABV_Definition extends ABV
{
    mainSideBlock = <SideBlock> {
        content: 'О',
        title: 'Определение'
    };

    regexp = /<def>(.+?)<\/def>/gm;

    constructor(subBlocks: AB_SubBlock[])
    {
        super(AccentBlockType.Definition, subBlocks);

        let content = subBlocks[0].body;
        content = content.replace(this.regexp, (match, defText) =>
        {
            // Adding index item
            if (subBlocks[0].header.id !== null)
                INDEX.add(IndexItemType.Definition, defText, subBlocks[0].header.id);
            //

            return `<a href="#${this.id}" class="definition">${defText}</a>`;
        });

        this.mainContentBlock.content = content;
    }
}

class ABV_Theorem extends ABV
{
    mainSideBlock = <SideBlock> {
        content: 'Т',
        title: 'Теорема'
    };

    constructor(subBlocks: AB_SubBlock[])
    {
        super(AccentBlockType.Theorem, subBlocks);

        // Adding index item
        if (subBlocks[0].header.id !== null)
            INDEX.add(IndexItemType.Theorem, subBlocks[0].header.text, subBlocks[0].header.id);
        //

        this.handleMain(subBlocks);
        this.handleProof(subBlocks);
    }

    handleMain(subBlocks: AB_SubBlock[])
    {
        let mainSubBlock = subBlocks[0];

        this.mainContentBlock.header = mainSubBlock.header.text;
        if (!this.mainContentBlock.header)
            this.mainContentBlock.header = 'Теорема';

        if (this.id !== null)
            this.mainContentBlock.header = `<a href="#${this.id}">${this.mainContentBlock.header}</a>`;

        this.mainContentBlock.content = mainSubBlock.body;
    }

    handleProof(subBlocks: AB_SubBlock[])
    {
        if (subBlocks.length === 1)
            return;
            
        let proof = subBlocks[1].body;

        this.sideBlocks.push({
            name: 'proof',
            content: `<i class="fas fa-chevron-down"></i>`,
            title: 'Доказательство'
        });

        this.contentBlocks.push({
            name: 'proof',
            header: 'Доказательство',
            content: proof
        });
    }
}

class ABV_Example extends ABV
{
    mainSideBlock = <SideBlock> {
        content: 'П',
        title: 'Пример'
    };

    constructor(subBlocks: AB_SubBlock[])
    {
        super(AccentBlockType.Example, subBlocks);

        this.handleMain(subBlocks);
        this.handleProof(subBlocks);
    }

    handleMain(subBlocks: AB_SubBlock[])
    {
        let mainSubBlock = subBlocks[0];

        this.mainContentBlock.header = mainSubBlock.header.text;
        if (!this.mainContentBlock.header)
            this.mainContentBlock.header = 'Пример';

        if (this.id !== null)
            this.mainContentBlock.header = `<a href="#${this.id}">${this.mainContentBlock.header}</a>`;

        this.mainContentBlock.content = mainSubBlock.body;
    }

    handleProof(subBlocks: AB_SubBlock[])
    {
        if (subBlocks.length === 1)
            return;
            
        let proof = subBlocks[1].body;

        this.sideBlocks.push({
            name: 'proof',
            content: `<i class="fas fa-chevron-down"></i>`,
            title: 'Разбор'
        });

        this.contentBlocks.push({
            name: 'proof',
            header: 'Разбор',
            content: proof
        });
    }
}