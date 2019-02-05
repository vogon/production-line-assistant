import { composeWithDevTools } from 'redux-devtools-extension';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Middleware, applyMiddleware, createStore } from 'redux';

import { App } from './components/App';
import { rootReducer } from './reducers/root';
import { dbLoaded } from './actions';
import { INITIAL_STATE } from './state';

const composeEnhancers = composeWithDevTools({});

function configureStore(initialState?: object) {
    const middlewares: Middleware[] = [];
    const enhancer = composeEnhancers(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState!, enhancer);
}

const store = configureStore(INITIAL_STATE);

async function loadDb(): Promise<void> {
    let data = await import('../data/data'),
        db = data.default ? data.default : { tasks: {}, upgrades: {} };

    store.dispatch(dbLoaded(db));
}

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);

loadDb();