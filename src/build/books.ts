import * as fs from "fs";
import * as path from 'path';
import { Article } from "../Article";
import { BookInfo } from "../Book";
import { CONFIG } from "../Config";

export let BOOKS: {[bookId: string]: BookInfo};

export function buildBooks()
{
    // TODO: Get rid of this. Main page should iterate books itself!!!
    BOOKS = {};
    //

    let bookIds = fs.readdirSync(path.join('data', 'books'), { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

    bookIds.forEach(bookId =>
    {
        let bookInfo = new BookInfo(bookId);
        BOOKS[bookId] = bookInfo;

        bookInfo.articleIds.forEach(articleId =>
        {
            let article = new Article(articleId, bookInfo);

            if (CONFIG.target !== null && article.id !== CONFIG.target)
                return;
            
            article.build();
        });
    });
}