interface IndexItemData
{
    type: { name: string; title: string; };
    path: string;
    article?: string;
    book?: string;
}

export enum IndexItemType
{
    Definition = 'definition',
    Theorem = 'theorem'
}

const IndexItemTypeTitle: { [key: string]: string } =
{
    definition: 'Определение',
    theorem: 'Теорема'
}

export class Index
{
    currentContext: { article: string; book: string; articlePath: string; };
    index: {[term: string]: IndexItemData[]} = {};

    setContext(context: { article: string; book: string; articlePath: string; })
    {
        this.currentContext = Object.assign(context);
    }

    getSorted()
    {
        let outIndex: { term: string, occurrences: IndexItemData[] }[] = [];

        Object.keys(this.index).sort().forEach(term =>
        {
            outIndex.push({ term: term, occurrences: this.index[term] });
        });

        return outIndex;
    }

    add(type: string, term: string, id: string)
    {
        // Capitalizing first letter
        term = term[0].toUpperCase() + term.slice(1);

        if (!(term in this.index))
            this.index[term] = [];

        this.index[term].push({
            type: { name: type, title: IndexItemTypeTitle[type] },
            article: this.currentContext.article,
            book: this.currentContext.book,
            path: this.currentContext.articlePath + '#' + id
        });
    }

    clear()
    {
        this.index = {};
    }
}

export const INDEX = new Index();