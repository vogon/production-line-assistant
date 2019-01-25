import * as csvParse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import * as minimist from 'minimist';
import * as path from 'path';

import { Db } from '../shared/db';
import { IniFile } from './ini-file';

let argv = minimist(process.argv.slice(2));
let plPath = argv._[0];
let outPath = argv._[1];

let db: Db = {
    tasks: {},
    upgrades: {}
};

// generate db entries from production line simulation data
let ini = new IniFile(path.join(plPath, "data/simulation/tasks/fit_chassis.ini"));
let csv = csvParse(
        fs.readFileSync(path.join(plPath, "data/simulation/tasks/tasks.csv")).toString(),
        { columns: true }
    );

ini;
csv;

// write db to output path
fs.writeFileSync(outPath, `
    import { Db } from '../shared/db';
    let db: Db = ${JSON.stringify(db)};
    export default db;
`);