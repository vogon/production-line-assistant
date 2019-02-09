import { RootAction, dbLoaded, DB_LOADED, taskCollapsed, TASK_COLLAPSED,
    taskExpanded, TASK_EXPANDED, taskChangedCount, TASK_CHANGED_COUNT } 
    from '../actions';
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

function replaceTaskStateWithId(tasks: ReadonlyMap<string, TaskState> | undefined,
        id: string, f: (state: TaskState) => TaskState) {
    let newState: Map<string, TaskState> = new Map();

    if (tasks !== undefined) {
        tasks.forEach((value, key) => {
            if (id.localeCompare(key) === 0) {
                newState.set(key, f(value));
            } else {
                newState.set(key, value);
            }
        });
    }

    return newState;
}

function onCollapse(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: ReturnType<typeof taskCollapsed>): ReadonlyMap<string, TaskState> {
    return replaceTaskStateWithId(tasks, action.payload.id, 
        (state) => ({ ...state, collapsed: true }));
}

function onExpand(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: ReturnType<typeof taskExpanded>): ReadonlyMap<string, TaskState> {
    return replaceTaskStateWithId(tasks, action.payload.id, 
        (state) => ({ ...state, collapsed: false }));
}

function onChangeCount(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: ReturnType<typeof taskChangedCount>): ReadonlyMap<string, TaskState> {
    return replaceTaskStateWithId(tasks, action.payload.id,
        (state) => ({ ...state, count: action.payload.count }));
}

export function tasksReducer(tasks: ReadonlyMap<string, TaskState> | undefined,
        action: RootAction): ReadonlyMap<string, TaskState> | undefined {
    switch (action.type) {
        case DB_LOADED: return onDbLoaded(tasks, action);
        case TASK_COLLAPSED: return onCollapse(tasks, action);
        case TASK_EXPANDED: return onExpand(tasks, action);
        case TASK_CHANGED_COUNT: return onChangeCount(tasks, action);
        default: return tasks || INITIAL_STATE.tasks;
    }
}