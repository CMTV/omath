import { Translator } from "../Translator";

const xml2js = require('xml2js').parseString;

export class Util
{
    static wrapCDATA(content: string): string
    {
        return `<![CDATA[${content}]]>`;
    }

    static wrapTagCDATA(tag: string, content: string): string
    {
        content = content.replace(Translator.tagRegexp(tag), (match, start, inner, end) =>
        {
            return start + Util.wrapCDATA(inner) + end;
        });

        return content;
    }

    static parseXML(content: string): any
    {
        let obj = null;

        xml2js(content, {
            trim: true,
            explicitRoot: false,
            explicitCharkey: true
        }, (error: any, result: any) => obj = result);

        return obj;
    }
}