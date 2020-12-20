import { Index } from ".";
import { ABV, XMLAccentBlock } from "../accent-block/AccentBlock";

enum IndexItemType
{
    Definition = 'definition',
    Theorem = 'theorem'
}

export abstract class IndexSubject extends XMLAccentBlock
{
    abstract type: IndexItemType;
    id: string = null;
    parsedXml: any = null;

    outId(): string
    {
        if (this.id === null) return null;
        return this.type + '_' + this.id;
    }

    canAddToIndex(): boolean
    {
        return (this.id !== null) && (!this.parsedXml?.$?.['no-index']);
    }

    toIndex(index: Index)
    {
        if (!this.canAddToIndex()) return;
        this.addToIndex(index);
    }

    abstract addToIndex(index: Index): void;
    abstract parse(raw: string): this;
    abstract toAccentBlock(): ABV;
}