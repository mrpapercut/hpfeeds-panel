import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import TopIP from './TopIP';
import TopPorts from './TopPorts';
import TopCountries from './TopCountries';

class Graphs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return E('div', {
            className: 'container'
        },
            E('div', {
                className: 'graph'
            },
                E('h2', {
                    className: 'chartsHeader'
                }, 'Top IP Addresses'),
                E('div', {
                    className: 'topIp'
                }, E(TopIP, {
                    colors: this.props.colors
                }))
            ),
            E('div', {
                className: 'graph'
            },
                E('h2', {
                    className: 'chartsHeader'
                }, 'Top Ports'),
                E('div', {
                    className: 'topPorts'
                }, E(TopPorts, {
                    colors: this.props.colors
                }))
            ),
            E('div', {
                className: 'graph'
            },
                E('h2', {
                    className: 'chartsHeader'
                }, 'Top Countries'),
                E('div', {
                    className: 'topCountries'
                }, E(TopCountries, {
                    colors: this.props.colors
                }))
            )
        );
    }
};

const mapStateToProps = () => {
    return {
        colors: [
            '#004c4c',
            '#006666',
            '#007f7f',
            '#009999',
            '#00b2b2',
            '#00cccc',
            '#00e5e5'
        ]
    };
};

export default connect(mapStateToProps, null)(Graphs);
