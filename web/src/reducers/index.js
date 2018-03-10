import {
    GET_FEEDS,
    RECEIVE_FEEDS
} from '../actions/mainActions';

const initialState = {
    feeds: [],
    total: 0
}

const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FEEDS:
            return state;

        case RECEIVE_FEEDS:
            return Object.assign({}, state, {
                feeds: state.feeds.concat(action.feeds),
                total: action.total
            });

        default:
            return state;
    }
}

export default mainReducer;
