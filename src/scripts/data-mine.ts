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
let tasksCsv = csvParse(
    fs.readFileSync(path.join(plPath, "data/simulation/tasks/tasks.csv")).toString(),
    { columns: true }
);
let locIni = new IniFile(path.join(plPath, "data/translations/EN/productiontasks.ini"));

function locForTask(locIni: IniFile, taskId: string): string {
    let variableName = `${taskId}_guiname`.toUpperCase();
    let rawValue = locIni.sections['config'][variableName];

    let quotedMatch = rawValue.match(/^"(.*)"$/);

    if (quotedMatch) {
        // some localizations are quoted, some aren't; unquote the quoted ones
        // TODO: currently we just assume that there are no quoted strings with
        // embedded quotation marks, because I really don't want to think about
        // that
        return quotedMatch[1];
    } else return rawValue;
}

for (let task of tasksCsv) {
    if (task['name'] === '') {
        // empty row; skip
        continue;
    } else {
        let id = task['name'];

        db.tasks[id] = {
            id: id,
            parentId: null,
            friendlyName: locForTask(locIni, id),
            processTime: parseInt(task['process time']) || 0,
            constructionCost: parseInt(task['construction cost']) || 0,
            powerDemand: parseInt(task['power demand']) || 0,
            subtaskIds: [],
            upgradeIds: []
        };
    }
}

// write db to output path
fs.writeFileSync(outPath, `
    import { Db } from '../shared/db';
    let db: Db = ${JSON.stringify(db)};
    export default db;
`);
