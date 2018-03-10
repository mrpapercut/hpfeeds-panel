import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';

import mainReducer from './reducers';

export default () => createStore(mainReducer, applyMiddleware(thunkMiddleware));