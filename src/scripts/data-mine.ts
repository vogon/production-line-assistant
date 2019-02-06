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
let simConfig = new IniFile(path.join(plPath, "data/simconfig.txt"));
let locIni = new IniFile(path.join(plPath, "data/translations/EN/productiontasks.ini"));

function locForTask(locIni: IniFile, taskId: string): string {
    let variableName = `${taskId}_guiname`.toUpperCase();
    let rawValue = locIni.sections['config'][variableName];

    // some localizations are quoted, some aren't; unquote the quoted ones
    // TODO: currently we just assume that there are no quoted strings with
    // embedded quotation marks, because I really don't want to think about
    // that
    let quotedMatch = rawValue.match(/^"(.*)"$/);

    if (quotedMatch) {
        return quotedMatch[1];
    } else return rawValue;
}

let hourLength = parseInt(simConfig.sections['config']["HOUR_LENGTH"]);
console.log(`hour length: ${hourLength}`);

for (let task of tasksCsv) {
    if (task['name'] === '') {
        // empty row; skip
        continue;
    } else {
        let id = task['name'];

        // convert the internal time units to seconds
        let processTimeInPLUnits = parseInt(task['process time']);
        let processTimeInSeconds = processTimeInPLUnits * (3600 / hourLength);

        db.tasks[id] = {
            id: id,
            parentId: null,
            friendlyName: locForTask(locIni, id),
            processTime: processTimeInSeconds || 0,
            constructionCost: parseInt(task['construction cost']) || 0,
            powerDemand: parseInt(task['power demand']) || 0,
            subtaskIds: [],
            upgradeIds: []
        };
    }
}

// fill in stuff from the INI file
let tasksDirPath = path.join(plPath, "data/simulation/tasks");
let tasksDir = fs.readdirSync(tasksDirPath);

for (let taskFileName of tasksDir) {
    if (taskFileName.endsWith(".ini")) {
        let iniFile = new IniFile(path.join(tasksDirPath, taskFileName));
        let taskId = iniFile.sections['task']['name'];

        let task = db.tasks[taskId];

        if (!task) {
            console.log(`found ini file for unknown task ${taskId}`);
            continue;
        }

        task.parentId = iniFile.sections['task']['parent'];

        for (let subtaskIndex in iniFile.sections['subtasksapplied']) {
            let subtaskId = iniFile.sections['subtasksapplied'][subtaskIndex];

            // tasks claim themselves as applied subtasks; skip those
            if (subtaskId.localeCompare(taskId) !== 0) {
                task.subtaskIds.push(subtaskId);
            }
        }

        for (let upgradeIndex in iniFile.sections['upgrades']) {
            task.upgradeIds.push(iniFile.sections['upgrades'][upgradeIndex]);
        }
    } else {
        // not an INI file; skip it
        continue;
    }
}

// write db to output path
fs.writeFileSync(outPath, `
    import { Db } from '../shared/db';
    let db: Db = ${JSON.stringify(db)};
    export default db;
`);
