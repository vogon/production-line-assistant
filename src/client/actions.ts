import { action } from 'typesafe-actions';

import { Db } from '../shared/db';

export const DB_LOADED = 'DB_LOADED';
export const TASK_COLLAPSED = 'TASK_COLLAPSED';
export const TASK_EXPANDED = 'TASK_EXPANDED';
export const TASK_CHANGED_COUNT = 'TASK_CHANGED_COUNT';

export type RootAction =
    ReturnType<typeof dbLoaded> |
    ReturnType<typeof taskCollapsed> |
    ReturnType<typeof taskExpanded> |
    ReturnType<typeof taskChangedCount>;

export const dbLoaded = (db: Db) => action(DB_LOADED, db);
export const taskCollapsed = (id: string) => action(TASK_COLLAPSED, { id });
export const taskExpanded = (id: string) => action(TASK_EXPANDED, { id });
export const taskChangedCount = (id: string, count: number) =>
    action(TASK_CHANGED_COUNT, { id, count });