import {Component, createElement as E} from 'react';
import DOM          from 'react-dom';
import {Provider}   from 'react-redux';

import createStore  from './createStore';
import {
    getFeeds,
    getCaptures,
    getBinaries
} from './actions/mainActions';

import Attacks      from './components/Attacks';
import WorldMap     from './components/WorldMap';
import Captures     from './components/Captures';
import Sensors      from './components/Sensors';
import Graphs       from './components/Graphs';

const store = createStore();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }

    componentDidMount() {
        const feedsLoop = () => {
            store.dispatch(getFeeds()).then(() =>
                this.setState(store.getState()));
        };

        window.setInterval(feedsLoop, 2000);
        feedsLoop();

        const capturesLoop = () => {
            store.dispatch(getCaptures());
            store.dispatch(getBinaries());
        };
        window.setInterval(capturesLoop, 10000);
        capturesLoop();
    }

    componentDidUpdate() {

    }

    render() {
        return E('div', {
            className: 'wrapper'
        },
            E(WorldMap),
            E(Attacks),
            E(Captures),
            E(Sensors),
            E(Graphs)
        );
    }
}

window.addEventListener('load', e => {
    DOM.render(E(Provider, {
        store: store
    },
        E(App, {})
    ), document.getElementById('appwrapper'));
});
