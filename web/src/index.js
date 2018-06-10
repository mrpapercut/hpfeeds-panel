import {Component, createElement as E} from 'react';
import DOM          from 'react-dom';
import {Provider}   from 'react-redux';

import createStore  from './createStore';

import Attacks      from './components/Attacks';
import WorldMap     from './components/WorldMap';
import Captures     from './components/Captures';
import Sensors      from './components/Sensors';
import Graphs       from './components/Graphs';
import Binaries     from './components/Binaries';

const store = createStore();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = store.getState();
    }

    render() {
        return E('div', {
            className: 'wrapper'
        },
            E(WorldMap),
            E(Attacks),
            E(Captures),
            E(Sensors),
            E(Graphs),
            E(Binaries)
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
