import {Component, createElement as E} from 'react';
import {formatDateLong as formatDate} from '../util/formatDate';

class Captures extends Component {
    constructor(props) {
        super(props);
    }

    filterCaptures(captures) {
        // Remove captures that don't have a URL set
        return captures.filter(cap =>
            cap._source.hasOwnProperty('url') && cap._source.url !== '');

        // TODO: remove duplicates
    }

    render() {
        const captures = this.filterCaptures(this.props.captures);

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
            }, formatDate(feed._source.timestamp)
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
