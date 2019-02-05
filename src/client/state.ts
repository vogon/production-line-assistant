import { Task } from "../shared/db";

export interface RootState {
    readonly tasks: ReadonlyArray<TaskState>;
}

export interface TaskState {
    readonly archetype: Task;
    readonly collapsed: boolean;
    readonly count: number;
    readonly childTasks: ReadonlyArray<TaskState>;
}

export const INITIAL_STATE: RootState = { tasks: [] };
