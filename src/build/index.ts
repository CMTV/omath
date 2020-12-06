import { INDEX } from "../Index";
import { PageView } from "../site/PageView";
import { PugWrapper } from "../site/PugWrapper";

interface IndexView extends PageView
{
    index: any;
}

export function buildIndex()
{
    let view: IndexView;

    view =
    {
        index: INDEX.getSorted(),
        SEO:
        {
            title: "Индекс",
            desc: "Список всех определений, теорем и аксиом на сайте."
        }
    }

    // TODO: Handle multiple ocurrences!!!

    PugWrapper.compile(
        'index',
        'index/index.html',
        view
    );
}