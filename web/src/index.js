import React, {Component, createElement as E} from 'react';
import DOM from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './createStore';
import {getFeeds} from './actions/mainActions';

import Attacks from './components/Attacks';

const store = createStore();

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

        return E('div', {
            className: 'wrapper'
        },
            // E('h2', {}, `Loaded ${feeds.length} out of ${total} feeds`),
            E(Attacks, {feeds: feeds}),
            E('div', {
                className: 'container'
            }, E('h2', {}, 'World map here')),
            E('div', {
                className: 'container'
            }, E('h2', {}, 'Latest captures')),
            E('div', {
                className: 'container'
            }, E('h2', {}, 'List of sensors'))
        );
    }
}

window.addEventListener('load', e => {
    ReactDOM.render((<Provider store={store}><App /></Provider>), document.body);
});