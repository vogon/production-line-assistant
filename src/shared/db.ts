export interface Task {
    id: string;
    parentId: string | null;

    friendlyName: string;

    processTime: number;
    constructionCost: number;
    powerDemand: number;

    subtaskIds: string[];
    
    upgradeIds: string[];
}

export enum EffectType {
    SUSpeed = "SU_SPEED",
    SUAbsPower = "SU_ABS_POWER"
}

export interface Effect {
    value: number;
    type: EffectType;
}

export interface Upgrade {
    id: string;
    cost: number;
    effects: Effect[];
}

export interface Db {
    tasks: { [taskId: string]: Task };
    upgrades: { [upgradeId: string]: Upgrade };
}