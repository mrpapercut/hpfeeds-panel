import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import mainConfig from '../../../config.json';

const _sensors = mainConfig.sensors;

class Sensors extends Component {
    constructor(props) {
        super(props);
    }

    getSensorNameById(sensorid) {
        const sensor = _sensors.filter(sensor => {
            return sensor.id === sensorid;
        });

        if (sensor && sensor[0] && sensor[0].name) {
            return sensor[0].name;
        } else {
            return sensorid;
        }
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
            className: 'feedHeader'
        }, ['', 'Sensor', 'Last known activity'].map((h, i) =>
            E('span', {
                key: i
            }, h))
        )];

        return E('section', {
            className: 'container sensorsWrapper'
        },
            E('h2', {
                className: 'sensorsHeader'
            }, 'Sensors'),
            E('div', {
                className: 'sensors innerWrapper'
            },
                headers.concat(this.filterSensors(feeds).map((sensor, i) => {
                    let diff = parseInt((+new Date() - +new Date(sensor._source.timestamp)) / 1000, 10);

                    return E('div', {
                        key: i,
                        className: 'feed'
                    },
                        E('span', {
                            className: diff < 1800 ? 'sensorActive' : 'sensorInactive'
                        }),
                        E('span', {
                            className: 'sensorName'
                        }, this.getSensorNameById(sensor._source.sensor)),
                        E('span', {
                            className: 'sensorLastActivity'
                        }, `${diff} seconds ago`)
                    );
                }))
            )
        );
    }
}

const mapStateToProps = ({feeds}) => {
    return {
        feeds
    };
};

export default connect(mapStateToProps, null)(Sensors);
