/**
 * Static config
 */
const config =
{
    url: 'https://example.com/',
    devUrl: 'http://localhost:8080/',
    title: 'Математика'
}

//
//
//

/**
 * Flags to alter build process.
 */
export enum BuildFlag
{
    /** If present, uses `devUrl` value instead of `url` from static config. */
    DEV_URL,

    PUG_PRETTY,
    /** If present, writes additional JSON file in the same location with pretty-formatted `view` object. */
    PUG_VIEW_LOG
}

class Config
{
    bFlags: BuildFlag[] = [];

    static EXCLUDE_FIELDS = ['url', 'devUrl'];

    constructor()
    {
        Object.keys(config).forEach(key =>
        {
            if (!Config.EXCLUDE_FIELDS.includes(key))
                // @ts-ignore
                this[key] = config[key];
        });
    }

    get url(): string
    {
        return (this.hasFlag(BuildFlag.DEV_URL) ? config.devUrl : config.url);
    }

    hasFlag(flag: BuildFlag): boolean
    {
        return this.bFlags.includes(flag);
    }

    setFlags(...flags: BuildFlag[])
    {
        flags.forEach((flag) =>
        {
            if (!this.bFlags.includes(flag))
                this.bFlags.push(flag);
        });
    }
}

export let CONFIG = new Config();