import { combineReducers } from 'redux';
import { tasksReducer } from './tasks';

export const rootReducer = combineReducers({
    tasks: tasksReducer
});