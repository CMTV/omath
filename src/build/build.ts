import * as fs from 'fs';
import * as path from 'path';

import { buildIndex } from ".";
import { BuildFlag, CONFIG } from "../Config";
import { INDEX } from "../Index";
import { PugWrapper } from "../site/PugWrapper";
import { buildBooks } from "./books";
import { buildMainPage } from "./main";

export function buildDraft()
{
    PugWrapper.compile(
        'testPage',
        'index.html'
    );
}

export function buildAll(devFlags = false)
{
    if (devFlags)
    {
        CONFIG.setFlags(
            BuildFlag.DEV_URL,
            BuildFlag.PUG_PRETTY,
            BuildFlag.PUG_VIEW_LOG
        );
    }

    clear();

    buildBooks();
    buildMainPage();
    buildIndex();

    fs.writeFileSync(
        path.join('out', 'CNAME'),
        'omath.ru'
    );
}

function clear()
{
    INDEX.clear();
}