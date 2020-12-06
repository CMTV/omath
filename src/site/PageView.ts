export interface PageSEO
{
    title: string|[string]|[string, string];
    desc?: string;
    tags?: string[];
}

export interface PageView
{
    SEO: PageSEO;
}