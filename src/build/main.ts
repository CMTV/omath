import { BookInfo } from "../Book";
import { PageView } from "../site/PageView";
import { PugWrapper } from "../site/PugWrapper";
import { BOOKS } from "./books";

interface MainView extends PageView
{
    books: {[bookId: string]: BookInfo}
}

export function buildMainPage()
{
    let view: MainView;

    view =
    {
        books: BOOKS,
        SEO:
        {
            title: ['Учебник по математике'],
            desc: 'Понятный и подробный учебник по математике, с объяснением всех тем, показательными примерами и строгими доказательствами теорем.',
            tags: ['учебник математики', 'учебник', 'математика']
        }
    }

    PugWrapper.compile(
        'main',
        'index.html',
        view
    );
}