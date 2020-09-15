import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';

const reducer = combineReducers({ user });
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger())
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
