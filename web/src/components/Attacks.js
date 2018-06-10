import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import {formatDateShort as formatDate} from '../util/formatDate';

class Attacks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {feeds} = this.props;

        const headers = [E('div', {
            key: 0,
            className: 'feed'
        }, ['Time', 'IP', 'Port', 'Protocol', 'Origin'].map((h, i) =>
            E('span', {
                key: i,
                className: 'feedHeader'
            }, h))
        )];

        return E('div', {
            className: 'container'
        },
            E('h2', {
                className: 'feedsHeader'
            }, 'Latest connections'),
            E('div', {
                className: 'feeds'
            },
                feeds.length > 0 ? headers.concat(feeds.map(feed =>
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
                            className: 'feedConnectionProtocol'
                        }, feed._source.connection_protocol || ''),
                        E('span', {
                            className: 'feedLocalLocation',
                            title: feed._source.city
                        }, `${feed._source.city}, ${feed._source.country || ''}`)
                    ))
                ) : null
            )
        );
    }
}

const mapStateToProps = ({feeds}) => {
    return {
        feeds
    };
};

export default connect(mapStateToProps, null)(Attacks);
