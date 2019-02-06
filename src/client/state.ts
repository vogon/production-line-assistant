import { Task } from "../shared/db";

export interface RootState {
    readonly tasks: ReadonlyMap<string, TaskState>;
}

export interface TaskState {
    readonly archetype: Task;
    readonly collapsed: boolean;
    readonly count: number;
}

export const INITIAL_STATE: RootState = { tasks: new Map() };
