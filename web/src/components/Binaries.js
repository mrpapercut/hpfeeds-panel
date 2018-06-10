import {Component, createElement as E} from 'react';
import {connect} from 'react-redux';

import {getBinaries} from '../actions/mainActions';

import {formatDateShort as formatDate} from '../util/formatDate';

class Binaries extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const binariesLoop = () => {
            this.props.getBinaries();
        };
        this.binariesLoop = window.setInterval(binariesLoop, 9000);
        binariesLoop();
    }

    componentWillUnmount() {
        window.clearInterval(this.binariesLoop);
    }

    filterBinaries(binaries) {
        const seen = {};

        return binaries.filter(bin => {
            if (!seen.hasOwnProperty(bin._source.hash)) {
                seen[bin._source.hash] = true;
                return bin;
            }
        });
    }

    countInstances(hash) {
        return this.props.binaries.filter(bin => {
            return bin._source.hash === hash;
        }).length;
    }

    render() {
        const binaries = this.filterBinaries(this.props.binaries);

        const headers = [E('div', {
            key: 0,
            className: 'feedHeader'
        }, ['Time', 'Hash', 'Count', 'Detection'].map((h, i) =>
            E('span', {
                key: i
            }, h))
        )];

        return E('section', {
            className: 'container'
        },
            E('h2', {
                className: 'binariesHeader'
            }, 'Caught Binaries'),
            E('div', {
                className: 'binaries'
            },
                binaries.length > 0 ? headers.concat(binaries.map(feed =>
                    E('div', {
                        key: feed._id,
                        className: 'feed'
                    },
                        E('span', {
                            className: 'feedTimestamp'
                        }, formatDate(feed._source.timestamp)),
                        E('span', {
                            className: 'feedHash'
                        }, feed._source.hash),
                        E('span', {
                            className: 'feedCount'
                        }, this.countInstances(feed._source.hash)),
                        E('a', {
                            className: 'feedDetection',
                            href: feed._source.permalink,
                            title: feed._source.vendors ? feed._source.vendors.map(vendor => {
                                return `${vendor.vendor}: ${vendor.result}`;
                            }).join(', ') : ''
                        }, feed._source.detection)
                    )
                )) : null
            )
        );
    }
}

const mapStateToProps = ({binaries}) => {
    return {
        binaries
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getBinaries: () => dispatch(getBinaries())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Binaries);
