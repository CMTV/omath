import { ABV, AB_Parser } from "./AccentBlock";
import { PugWrapper } from "./site/PugWrapper";

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

    //
    //
    //

    static renderComponents(content: string): string
    {
        content = (new AccentBlock).render(content);

        return content;
    }

    //
    //
    //

    static renderAll(content: string): string
    {
        content = this.renderComponents(content);
        content = Translator.renderSimple(content);

        return content;
    }

    static renderSimple(content: string): string
    {
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

//
// Accent block
//

class AccentBlock extends Component<ABV>
{
    name = 'accent-block';
    static regexp = /^\|\|\|[\s\S]+?^\|\|\|$/gm;

    render(content: string)
    {
        content = content.replace(AccentBlock.regexp, (match) =>
        {
            let view = AB_Parser.parse(match);
            return this.renderComponent(view);
        });

        return content;
    }
}