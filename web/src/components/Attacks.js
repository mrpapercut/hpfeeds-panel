import React, {Component, createElement as E} from 'react';
import DOM from 'react-dom';

class Attacks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {feeds} = this.props;

        return E('div', {
            className: 'container'
        },
            E('h2', {
                className: 'feedsHeader'
            }, 'Latest connections'),
            E('div', {
                className: 'feeds'
            },
                feeds.length > 0 ? feeds.map(feed => E('div', {
                    key: feed._id,
                    className: 'feed'
                },
                    E('span', {
                        className: 'feedHostIp'
                    }, `${feed._source.remote_host}:${feed._source.remote_port}`),
                    E('span', {
                        className: 'feedLocalPort'
                    }, feed._source.local_port),
                    E('span', {
                        className: 'feedLocalLocation'
                    }, feed._source.city)
                )) : null
            )
        )
    }
}

export default Attacks;