import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import {getCaptures} from '../actions/mainActions';

import {formatDateLong as formatDate} from '../util/formatDate';

class Captures extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const capturesLoop = () => {
            this.props.getCaptures();
        };
        this.capturesLoop = window.setInterval(capturesLoop, 30000);
        capturesLoop();
    }

    componentWillUnmount() {
        window.clearInterval(this.capturesLoop);
    }

    filterCaptures(captures) {
        const unique = (array) => {
            return array.filter((e, i) => array.findIndex(a => a._source['url'] === e._source['url']) === i);
        };

        // Remove captures that don't have a URL set
        captures = unique(captures.filter(cap => {
            return cap._source.hasOwnProperty('url') && cap._source.url !== '';
        }));

        return captures;
    }

    render() {
        const captures = this.filterCaptures(this.props.captures);

        const headers = [E('div', {
            key: 0,
            className: 'feedHeader'
        }, ['Time', 'IP', 'Port', 'Origin', 'Url'].map((h, i) =>
            E('span', {
                key: i
            }, h))
        )];

        return E('section', {
            className: 'container capturesWrapper'
        },
            E('h2', {
                className: 'capturesHeader'
            }, 'Caught URLs'),
            E('div', {
                className: 'captures innerWrapper'
            },
                captures.length > 0 ? headers.concat(captures.map(feed =>
                    E('div', {
                        key: feed._id,
                        className: 'feed'
                    },
                        E('span', {
                            className: 'feedTimestamp'
                        }, formatDate(feed._source.timestamp)),
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
                    )
                )) : null
            )
        );
    }
}

const mapStateToProps = ({captures}) => {
    return {
        captures
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCaptures: () => dispatch(getCaptures())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Captures);
