import {Component, createElement as E} from 'react';

import mainConfig from '../../../config.json';

const _sensors = mainConfig.sensors;

class Sensors extends Component {
    constructor(props) {
        super(props);
    }

    filterSensors(feeds) {
        let sensors = feeds
            .map(f => f._source.sensor)
            .filter((feed, index, arr) => {
                return arr.indexOf(feed) === index;
            });

        return sensors.map(s => feeds.filter(f => f._source.sensor === s)[0]);
    }

    render() {
        const {feeds} = this.props;

        const headers = [E('div', {
            key: -1,
            className: 'sensor'
        }, ['', 'Sensor', 'Last known activity'].map((h, i) =>
            E('span', {
                key: i,
                className: 'sensorHeader'
            }, h))
        )];

        return E('div', {
            className: 'container'
        },
        E('h2', {
            className: 'capturesHeader'
        }, 'Sensors'),
        E('div', {
            className: 'sensors'
        },
        headers.concat(this.filterSensors(feeds).map((sensor, i) => {
            let diff = parseInt((+new Date() - +new Date(sensor._source.timestamp)) / 1000, 10);

            return E('div', {
                key: i,
                className: 'sensor'
            },
            E('span', {
                className: diff < 1800 ? 'sensorActive' : 'sensorInactive'
            }),
            E('span', {
                className: 'sensorName'
            }, _sensors[sensor._source.sensor] || sensor._source.sensor),
            E('span', {
                className: 'sensorLastActivity'
            }, `${diff} seconds ago`)
            );
        }))
        )
        );
    }
}

export default Sensors;
