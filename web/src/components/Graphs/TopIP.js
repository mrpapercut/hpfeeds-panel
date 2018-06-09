import {Component, createElement as E} from 'react';
import {PieChart, Pie, Cell, Legend, Tooltip} from 'recharts';
import {connect} from 'react-redux';

import getTopFromFeeds from '../../util/getTopFromFeeds';

class Top50IP extends Component {
    constructor(props) {
        super(props);
    }

    parseTopIp() {
        const {feeds} = this.props;

        return getTopFromFeeds(feeds, 'remote_host', 10);
    }

    render() {
        const data = this.parseTopIp();

        return E(PieChart, {
            width: 280,
            height: 300
        },
            E(Pie, {
                dataKey: 'value',
                nameKey: 'name',
                data
            },
                data.map((entry, index) => E(Cell, {
                    fill: this.props.colors[index % this.props.colors.length],
                    key: index
                }))
            ),
            E(Tooltip),
            E(Legend)
        );
    }
};

const mapStateToProps = ({feeds}) => {
    return {
        feeds
    };
};

export default connect(mapStateToProps, null)(Top50IP);
