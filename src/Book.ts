import * as fs from 'fs';
import * as path from 'path';

export const BOOKS_DIR = path.join('data', 'books');

interface BookData
{
    id: string;
    title: string;
    desc: string;
    nav: NavItemData;
}

interface NavItemData
{
    [key: string]: string|NavItemData;
}

export class BookInfo
{
    id: string;
    title: string;
    desc: string;
    nav: NavItem[];
    
    articleIds: string[] = [];

    constructor(id: string)
    {
        let bookData = <BookData> JSON.parse(
            fs.readFileSync(
                path.join(BOOKS_DIR, id, 'book.json'),
                { encoding: 'utf-8' }
            )
        );

        this.id = bookData.id;
        this.title = bookData.title;
        this.desc = bookData.desc;

        // Making nav
        {
            this.nav = [];

            let parseItem = (item: NavItemData, holderArr: NavItem[]) =>
            {
                Object.keys(item).forEach(key =>
                {
                    let value = item[key];
                
                    if (typeof value === 'string')
                    {
                        let navItem = new ArticleNavItem();
                        navItem.title = key;
                        navItem.id = value;
                        holderArr.push(navItem);

                        this.articleIds.push(this.id + '/' + value);
                    }

                    if (typeof value === 'object')
                    {
                        let navItem = new CategoryNavItem();
                        navItem.title = key;
                        parseItem(value, navItem.subNav);
                        holderArr.push(navItem);
                    }
                });
            };

            parseItem(bookData.nav, this.nav);
        }
    }    
}

enum NavItemType
{
    Article = "ARTICLE",
    Category = "CATEGORY"
}

abstract class NavItem
{
    type: NavItemType;
    title: string;
}

class ArticleNavItem extends NavItem
{
    type = NavItemType.Article;
    id: string;
}

class CategoryNavItem extends NavItem
{
    type = NavItemType.Category;
    subNav: NavItem[] = [];
}