interface IndexItemData
{
    type: IndexItemType;
    path: string;
    article?: string;
    book?: string;
}

export enum IndexItemType
{
    Definition = 'definition',
    Theorem = 'theorem'
}

export class Index
{
    currentContext: { article: string; book: string; articlePath: string; }
    index: {[term: string]: IndexItemData[]} = {}

    getSorted()
    {
        let outIndex: { term: string, occurrences: IndexItemData[] }[] = [];

        Object.keys(this.index).sort().forEach(term =>
        {
            outIndex.push({ term: term, occurrences: this.index[term] });
        });

        return outIndex;
    }

    add(type: IndexItemType, term: string, id: string)
    {
        term = term.toLowerCase();

        if (!(term in this.index))
            this.index[term] = [];

        this.index[term].push({
            type: type,
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

export let INDEX = new Index();