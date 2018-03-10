import React, {Component, createElement as C} from 'react';
import DOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import {getFeeds} from './actions/mainActions';
import mainReducer from './reducers';

let store = createStore(mainReducer, applyMiddleware(thunkMiddleware));

class App extends Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }
    
    componentDidMount() {
        store.dispatch(getFeeds()).then(() => 
            this.setState(store.getState())
        );
    }

    componentDidUpdate() {
        
    }

    render() {
        const {feeds, total} = this.state;

        return C('div', {
            id: 'thisdiv'
        },
            `Loaded ${feeds.length} out of ${total} feeds`,
            feeds.length > 0 ? feeds.map(feed => C('div', {
                key: feed._id,
                className: 'feed'
            }, `${feed._source.remote_host}:${feed._source.remote_port}`)) : null
        );
    }
}

window.addEventListener('load', e => {
    ReactDOM.render((<Provider store={store}><App /></Provider>), document.body);
});