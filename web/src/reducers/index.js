import {
    GET_FEEDS,
    RECEIVE_FEEDS,
    GET_CAPTURES,
    RECEIVE_CAPTURES
} from '../actions/mainActions';

const initialState = {
    feeds: [],
    totalFeeds: 0,
    captures: [],
    totalCaptures: 0
}

const combineNewFeeds = (currentFeeds, newFeeds, i) => {
    currentFeeds = currentFeeds.map(f => {
        f._isNew = false;
        return f;
    });

    newFeeds.forEach(f => {
        if (currentFeeds.filter(cf => {
            return cf._source.timestamp === f._source.timestamp
                && cf._source.city === f._source.city;
        }).length === 0) {
            f._isNew = true;
            currentFeeds.push(f);
        }
    });

    currentFeeds.sort((a, b) => {
        return b._source.timestamp - a._source.timestamp;
    });

    return currentFeeds;
}

const mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FEEDS:
            return state;

        case RECEIVE_FEEDS:
            return Object.assign({}, state, {
                feeds: combineNewFeeds(state.feeds, action.feeds),
                totalFeeds: action.totalFeeds
            });

        case GET_CAPTURES:
            return state;

        case RECEIVE_CAPTURES:
            return Object.assign({}, state, {
                captures: combineNewFeeds(state.captures, action.captures, !0),
                totalCaptures: action.totalCaptures
            });

        default:
            return state;
    }
}

export default mainReducer;
