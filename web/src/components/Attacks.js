import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import {getFeeds} from '../actions/mainActions';

import {formatDateShort as formatDate} from '../util/formatDate';

class Attacks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feeds: this.props.feeds
        };
    }

    componentDidMount() {
        const feedsLoop = () => {
            this.props.getFeeds();
        };
        this.feedsLoop = window.setInterval(feedsLoop, 2000);
        feedsLoop();
    }

    componentWillUnmount() {
        window.clearInterval(this.feedsLoop);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.feeds.length > this.state.feeds.length) {
            this.setState({
                feeds: newProps.feeds
            });
        }
    }

    render() {
        const feeds = this.state.feeds.slice(0, 14);

        const headers = [E('div', {
            key: 0,
            className: 'feedHeader'
        }, ['Time', 'IP', 'Port', 'Protocol', 'Origin'].map((h, i) =>
            E('span', {
                key: i
            }, h))
        )];

        return E('section', {
            className: 'container attacksWrapper'
        },
            E('h2', {
                className: 'feedsHeader'
            }, 'Latest connections'),
            E('div', {
                className: 'feeds innerWrapper'
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

const mapDispatchToProps = dispatch => {
    return {
        getFeeds: () => dispatch(getFeeds())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Attacks);
