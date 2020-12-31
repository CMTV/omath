import { AccentBlock } from "./accent-block/AccentBlock";
import { Example } from "./accent-block/Example";
import { INDEX, IndexItemType } from "./index/Index";
import { Definition } from "./index/Definition";
import { Theorem } from "./index/Theorem";
import { PugWrapper } from "./site/PugWrapper";
import { Dodem } from "./accent-block/Dodem";
import { Important } from "./accent-block/Important";

const mdIt = require('markdown-it')({
    html: true,
    subscript: false,
    superscript: false,
    typographer: true,
    quotes: '«»""',
});

mdIt.use(require('markdown-it-attrs'), {
    leftDelimiter: '{:'
});

mdIt.use(require('markdown-it-anchor'), {
    level: 2,
    permalink: true,
    permalinkSymbol: `<i class="fas fa-link"></i>`,
    permalinkAttrs: () => { return { title: 'Ссылка на этот раздел' } }
});

const mathMacro = require('../data/math');
const katex = require('../site/vendor/katex/katex.min.js');

//
//
//

export class Translator
{
    static metaRegex = /^---$([\s\S]*?)^---$/m;

    static getMeta(content: string)
    {
        let match = this.metaRegex.exec(content);

        if (match === null)
            return null;

        return JSON.parse(match[1].trim());
    }

    static getContent(content: string)
    {
        return content.replace(this.metaRegex, '').trim();
    }

    //
    //
    //

    static hRegepx = /^(#{2,6}) (.*) {:.*#(.*?) .*?}$/gm;

    static getHeadings(content: string): Heading[]
    {
        let headings: Heading[] = [];
        let matches = content.matchAll(this.hRegepx);

        for (let match of matches)
        {
            headings.push(<Heading> {
                level: match[1].length,
                title: match[2],
                id: match[3]
            });
        }

        return headings;
    }

    //
    // Math
    //

    static mathRegexp =
    {
        display: [
            /^\$\$([\s\S]*?)\$\$$/gm,
            /^\\\[([\s\S]*?)\\\]$/gm
        ],

        inline: [
            /(?<!\$)\$(?!\$)(.*?)\$/g,
            /\\\((.*?)\\\)/g
        ]
    }

    static renderMath(content: string): string
    {
        if (typeof content === 'undefined') return content;

        let katexOptions = (isDisplay = true) =>
        {
            let out: any = {};

            out.output = 'html';
            out.displayMode = isDisplay;
            out.strict = 'ignore';
            out.macros = mathMacro;
            
            return out;
        };

        // Display

        this.mathRegexp.display.forEach((regexp) =>
        {
            content = content.replace(regexp, (match, math) => { return katex.renderToString(math, katexOptions()) });
        });

        // Inline

        this.mathRegexp.inline.forEach((regexp) =>
        {
            content = content.replace(regexp, (match, math) => { return katex.renderToString(math, katexOptions(false)) });
        });

        return content;
    }

    //
    //
    //

    static renderMarkdown(content: string): string
    {
        return mdIt.render(content);
    }

    static tagRegexp(tag: string)
    {
        return new RegExp(`(<${tag}(?:.+?=".+?")*?>)([\\s\\S]+?)(<\\/${tag}>)`, 'gm');
    }

    static tagSingleRegexp(tag: string)
    {
        return new RegExp(`(<${tag}(?:.+?=".+?")*?) (\\/>)`, 'gm');
    }

    //
    // Accent Blocks
    //

    static renderAccentBlocks(content: string): string
    {
        // Index Items
        content = this.renderIndexItems(content);

        // Examples
        content = content.replace(this.tagRegexp('example'), match =>
        {
            return AccentBlock.compile((new Example).parse(match).toAccentBlock());
        });

        // Dodems
        content = content.replace(this.tagSingleRegexp('dodem'), match =>
        {
            return AccentBlock.compile((new Dodem).parse(match).toAccentBlock());
        });

        // Importants
        content = content.replace(this.tagRegexp('important'), match =>
        {
            return AccentBlock.compile((new Important).parse(match).toAccentBlock());
        });

        return content;
    }

    static renderIndexItems(content: string): string
    {
        Object.values(IndexItemType).forEach(type =>
        {
            content = content.replace(this.tagRegexp(type), match =>
            {
                let subject = null;

                switch(type)
                {
                    case IndexItemType.Definition:
                        subject = (new Definition).parse(match);
                        break;
                    case IndexItemType.Theorem:
                        subject = (new Theorem).parse(match);
                        break;
                }

                subject.toIndex(INDEX);
                return AccentBlock.compile(subject.toAccentBlock());
            });
        });

        return content;
    }

    //
    // Components
    //

    static renderAccentLinks(content: string): string
    {
        content = (new AccentLink).render(content);

        return content;
    }

    //
    //
    //

    static renderAll(content: string): string
    {
        if (content === null) return content;

        content = this.renderAccentBlocks(content);
        
        content = Translator.renderSimple(content);

        return content;
    }

    static renderSimple(content: string): string
    {
        if (content === null) return content;

        content = content.replace(/  +/gm, ' ');
        content = content.replace(/^ +/gm, '');

        content = this.renderAccentLinks(content);

        content = this.renderMath(content);
        content = this.renderMarkdown(content);

        return content;
    }
}

export interface Heading
{
    level: number;
    id: string;
    title: string;
}

// =====================================
// Components
// =====================================

abstract class Component<TView>
{
    abstract name: string;
    abstract render(content: string): string;

    renderComponent(view: TView): string
    {
        return PugWrapper.render(`components/${this.name}`, view);
    }
}

class AccentLink extends Component<{ type: string, text: string, id: string }>
{
    name = 'accent-link';

    static shortcutMap: any =
    {
        d: 'definition',
        t: 'theorem',
        e: 'example'
    }

    static regexp = /<(\S+?):\[(.+?)\]\((.+?)\)>/gm;

    render(content: string): string
    {
        content = content.replace(AccentLink.regexp, (match, type, text, id) =>
        {
            return this.renderComponent({ type: AccentLink.shortcutMap[type], text: text.trim(), id: id.trim() });
        });

        return content;
    }
}