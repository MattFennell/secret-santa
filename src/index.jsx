/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import * as serviceWorker from './serviceWorker';
import { firebaseApp } from './config/fbConfig';
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';
import App from './App';
import 'react-notifications-component/dist/theme.css';

const history = createBrowserHistory();

// need firestore permissions to read this
// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    logErrors: false
};

const sagaMiddleware = createSagaMiddleware();

const isDevelopment = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const enhancers = isDevelopment ? compose(
    applyMiddleware(routerMiddleware(history), sagaMiddleware),
    (window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f)
) : compose(
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
);

const store = createStore(createRootReducer(history), enhancers);

const rrfProps = {
    firebase: firebaseApp,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
};

sagaMiddleware.run(rootSaga, getFirebase);

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <App history={history} />
        </ReactReduxFirebaseProvider>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();
