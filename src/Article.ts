import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';

import { BookInfo, BOOKS_DIR } from "./Book";
import { INDEX } from './Index';
import { PageSEO, PageView } from './site/PageView';
import { PugWrapper } from './site/PugWrapper';
import { Heading, Translator } from './Translator';

export const RESERVED_FILENAMES = {
    ARTICLE: 'article.md'
}

interface ArticleData
{
    title: string;
    desc: string;
    tags: string[];
}

interface ArticleView extends PageView
{
    id: string;
    book: BookInfo;
    toc: any;
    content: string;
    meta: ArticleData;
}

export class Article
{
    id: string;
    title: string;
    toc: Heading[];

    meta: ArticleData;
    content: string;
    contentOut: string;

    bookInfo: BookInfo;

    constructor(id: string, bookInfo: BookInfo)
    {
        this.bookInfo = bookInfo;
        this.id = id;

        let articleFile = fs.readFileSync(this.getFullPath(RESERVED_FILENAMES.ARTICLE), { encoding: 'utf-8' });

        this.meta = Translator.getMeta(articleFile);

        // Setting index context
        INDEX.setContext({
            article: this.meta.title,
            book: this.bookInfo.title,
            articlePath: this.id
        });
        //

        this.content = Translator.getContent(articleFile);
        this.contentOut = Translator.renderAll(this.content);

        this.title = this.meta.title;
        this.toc = Translator.getHeadings(this.content);
    }

    getFullPath(relPath: string = '/'): string
    {
        return path.join(
            BOOKS_DIR,
            path.normalize(this.id),
            relPath
        );
    }

    getFullOutPath(relPath: string = '/'): string
    {
        return path.join(
            'out',
            path.normalize(this.id),
            relPath
        );
    }

    getNestedToc()
    {
        // Produly copied from Stack Overflow
        // @see https://stackoverflow.com/questions/59487521/nesting-array-based-on-level

        let result: any = [],
            indices: any = [],
            levels = [result];

        this.toc.forEach(o => {
            let index = indices.findIndex((level: any) => level >= o.level);

            if (index === -1)
                index = indices.push(o.level) - 1;
            else
                indices.length = index + 1;

            levels[index].push(Object.assign({}, o, { children: levels[index + 1] = [] }));
        });

        return result;
    }

    moveFiles()
    {
        fs.readdirSync(this.getFullPath())
        .filter(fileName => {
            return !Object.values(RESERVED_FILENAMES).includes(fileName);
        })
        .forEach(fileName => {
            fse.copySync(this.getFullPath(fileName), this.getFullOutPath(fileName));
        });
    }

    build()
    {
        let view: ArticleView;

        let SEO: PageSEO =
        {
            title: [this.meta.title, this.bookInfo.title],
            desc: this.meta.desc,
            tags: this.meta.tags
        };

        view =  {
            id: this.id,
            book: this.bookInfo,
            toc: this.getNestedToc(),
            content: this.contentOut,
            meta: this.meta,
            SEO: SEO
        };

        PugWrapper.compile(
            'article',
            path.join(path.normalize(this.id), 'index.html'),
            view
        );

        this.moveFiles();
    }
}