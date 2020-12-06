import pug from 'pug';
import fs from 'fs';
import path from 'path';

import { CONFIG, BuildFlag } from '../Config';
import { Site } from './Site';

export class PugWrapper
{
    static render(layout: string, view: any = {}): string
    {
        let configView = {
            basedir: Site.LAYOUT,
            pretty: CONFIG.hasFlag(BuildFlag.PUG_PRETTY),
            _: CONFIG // Allow CONFIG calls from inside layout files
        };

        return pug.renderFile(
            path.join(Site.LAYOUT, path.normalize(layout + '.pug')),
            { ...configView, ...view}
        );
    }

    static compile(layout: string, dest: string, view: any = {})
    {
        let rendered = this.render(layout, view);
        let _dest = path.join('out', path.normalize(dest));

        // Writing rendered
        fs.mkdirSync(path.parse(_dest).dir, { recursive: true });
        fs.writeFileSync(_dest, rendered);

        // Writing JSON view (if necessary)
        if (CONFIG.hasFlag(BuildFlag.PUG_VIEW_LOG))
        {
            fs.writeFileSync(
                _dest + '.json',
                JSON.stringify(view, null, 4)
            );
        }
    }
}