import { RootAction, dbLoaded, DB_LOADED } from '../actions';
import { TaskState } from '../state';

import { INITIAL_STATE } from '../state';

function onDbLoaded(_: ReadonlyArray<TaskState> | undefined, 
        action: ReturnType<typeof dbLoaded>): ReadonlyArray<TaskState> {
    let newState: TaskState[] = [];

    for (let taskName in action.payload.tasks) {
        let task = action.payload.tasks[taskName];

        newState.push({
            archetype: task,
            collapsed: true,
            count: 1,
            childTasks: []
        });
    }

    return newState;
}

export function tasksReducer(tasks: ReadonlyArray<TaskState> | undefined,
        action: RootAction): ReadonlyArray<TaskState> | undefined {
    switch (action.type) {
        case DB_LOADED: return onDbLoaded(tasks, action);
        default: return tasks || INITIAL_STATE.tasks;
    }
}