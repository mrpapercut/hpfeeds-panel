import {Component, createElement as E} from 'react';

class Captures extends Component {
    constructor(props) {
        super(props);
    }

    formatDate(ts) {
        const pad = str => ('0' + str).substr(-2);

        let d = new Date(ts);

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${('00' + d.getMilliseconds()).substr(-3)}`;
    }

    render() {
        const {captures} = this.props;

        const headers = [E('div', {
            key: 0,
            className: 'feed'
        }, ['Time', 'IP', 'Port', 'Origin', 'Url'].map((h, i) =>
            E('span', {
                key: i,
                className: 'feedHeader'
            }, h))
        )];

        return E('div', {
            className: 'container'
        },
        E('h2', {
            className: 'capturesHeader'
        }, 'Latest captures'),
        E('div', {
            className: 'captures'
        },
        captures.length > 0 ? headers.concat(captures.map(feed =>
            E('div', {
                key: feed._id,
                className: 'feed'
            },
            E('span', {
                className: 'feedTimestamp'
            }, this.formatDate(feed._source.timestamp)
            ),
            E('span', {
                className: 'feedHostIp'
            }, feed._source.remote_host),
            E('span', {
                className: 'feedLocalPort'
            }, feed._source.local_port),
            E('span', {
                className: 'feedLocalLocation',
                title: feed._source.city
            }, feed._source.city),
            E('span', {
                className: 'feedUrl'
            }, feed._source.url)
            ))) : null
        )
        );
    }
}

export default Captures;
