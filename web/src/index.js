import React, {Component, createElement as E} from 'react';
import DOM          from 'react-dom';
import {Provider}   from 'react-redux';

import createStore  from './createStore';
import {
    getFeeds,
    getCaptures
} from './actions/mainActions';

import Attacks      from './components/Attacks';
import WorldMap     from './components/WorldMap';
import Captures     from './components/Captures';
import Sensors      from './components/Sensors';

const store = createStore();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }

    componentDidMount() {
        const performGet = () => {
            store.dispatch(getFeeds()).then(() =>
                this.setState(store.getState()));

            store.dispatch(getCaptures()).then(() =>
                this.setState(store.getState()));
        };

        window.setInterval(performGet, 2000);
        performGet();
    }

    componentDidUpdate() {

    }

    render() {
        const {
            feeds, totalFeeds,
            captures, totalCaptures
        } = this.state;

        return E('div', {
            className: 'wrapper'
        },
            E(WorldMap, {feeds: feeds}),
            E(Attacks, {feeds: feeds}),
            E(Captures, {captures: captures}),
            E(Sensors, {feeds: feeds})
        );
    }
}

window.addEventListener('load', e => {
    ReactDOM.render((<Provider store={store}><App /></Provider>), document.body);
});