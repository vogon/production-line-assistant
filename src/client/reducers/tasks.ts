import { RootAction, dbLoaded, DB_LOADED } from '../actions';
import { TaskState } from '../state';

import { INITIAL_STATE } from '../state';

function onDbLoaded(_: ReadonlyMap<string, TaskState> | undefined, 
        action: ReturnType<typeof dbLoaded>): ReadonlyMap<string, TaskState> {
    let newState: Map<string, TaskState> = new Map();

    for (let taskName in action.payload.tasks) {
        let task = action.payload.tasks[taskName];

        newState.set(taskName, {
            archetype: task,
            collapsed: true,
            count: 1
        });
    }

    return newState;
}

export function tasksReducer(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: RootAction): ReadonlyMap<string, TaskState> | undefined {
    switch (action.type) {
        case DB_LOADED: return onDbLoaded(tasks, action);
        default: return tasks || INITIAL_STATE.tasks;
    }
}