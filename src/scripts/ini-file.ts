import * as fs from 'fs';

export type IniSection = { [key: string]: string };

export class IniFile {
    constructor(path: string) {
        this.sections = {};
        this.sections[IniFile.DEFAULT_SECTION] = {};

        this.load(path);
    }

    static DEFAULT_SECTION: Readonly<string> = "_default";
    sections: { [sectionName: string]: IniSection };

    private load(path: string) {
        let text = fs.readFileSync(path);
        let lines = text.toString().split(/\r?\n/);

        let currentSection = IniFile.DEFAULT_SECTION;

        for (let line of lines) {
            if (/^#/.test(line)) {
                // comment; drop it on the floor
            } else {
                // check for section header
                let sectionMatch = line.match(/^\[(.*)\]$/);

                if (sectionMatch != null) {
                    currentSection = sectionMatch[1];
                    this.sections[currentSection] = {};
                    continue;
                }

                // otherwise figure out the variable/value for an assignment
                let assignmentMatch = line.match(/^([^=\n]+)=?(.*)$/);

                if (assignmentMatch) {
                    // normal assignment
                    let variableName = assignmentMatch[1].trim();
                    let value = assignmentMatch[2].trim();

                    this.sections[currentSection][variableName] = value;
                } else {
                    // empty line (or an = alone on a line?); do nothing
                }
            }
        }
    }
}