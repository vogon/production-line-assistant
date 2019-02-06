import { RootAction, dbLoaded, DB_LOADED, taskCollapsed, TASK_COLLAPSED,
    taskExpanded, TASK_EXPANDED } from '../actions';
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

function onCollapse(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: ReturnType<typeof taskCollapsed>): ReadonlyMap<string, TaskState> {
    let newState: Map<string, TaskState> = new Map();

    if (tasks !== undefined) {
        tasks.forEach((value, key) => {
            if (action.payload.id.localeCompare(key) === 0) {
                newState.set(key, { ...value, collapsed: true });
            } else {
                newState.set(key, value);
            }
        });
    }

    return newState;
}

function onExpand(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: ReturnType<typeof taskExpanded>): ReadonlyMap<string, TaskState> {
    let newState: Map<string, TaskState> = new Map();

    if (tasks !== undefined) {
        tasks.forEach((value, key) => {
            if (action.payload.id.localeCompare(key) === 0) {
                newState.set(key, { ...value, collapsed: false });
            } else {
                newState.set(key, value);
            }
        });
    }

    return newState;
}

export function tasksReducer(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: RootAction): ReadonlyMap<string, TaskState> | undefined {
    switch (action.type) {
        case DB_LOADED: return onDbLoaded(tasks, action);
        case TASK_COLLAPSED: return onCollapse(tasks, action);
        case TASK_EXPANDED: return onExpand(tasks, action);
        default: return tasks || INITIAL_STATE.tasks;
    }
}