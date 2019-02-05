import { action } from 'typesafe-actions';

import { Db } from '../shared/db';

export const DB_LOADED = 'DB_LOADED';

export type RootAction =
    ReturnType<typeof dbLoaded>;

export const dbLoaded = (db: Db) => action(DB_LOADED, db);