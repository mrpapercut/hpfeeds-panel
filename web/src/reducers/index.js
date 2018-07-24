import {
    GET_FEEDS,
    RECEIVE_FEEDS,
    GET_CAPTURES,
    RECEIVE_CAPTURES,
    GET_BINARIES,
    RECEIVE_BINARIES
} from '../actions/mainActions';

const initialState = {
    feeds: [],
    totalFeeds: 0,
    captures: [],
    totalCaptures: 0,
    binaries: []
};

const combineNewFeeds = (currentFeeds, newFeeds, i) => {
    currentFeeds = currentFeeds.map(f => {
        f._isNew = false;
        return f;
    });

    newFeeds = newFeeds.map(f => {
        f._isNew = true;
        return f;
    });

    const unique = (array, propertyName) => {
        return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
    };

    let feeds = unique(currentFeeds.concat(newFeeds), '_id').sort((a, b) => {
        return b._source.timestamp - a._source.timestamp;
    });

    return feeds;
};

const mainReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_FEEDS:
        return state;

    case RECEIVE_FEEDS:
        return Object.assign({}, state, {
            // Only keep track of last 500 feeds
            feeds: combineNewFeeds(state.feeds, action.feeds).slice(0, 500),
            totalFeeds: action.totalFeeds
        });

    case GET_CAPTURES:
        return state;

    case RECEIVE_CAPTURES:
        return Object.assign({}, state, {
            captures: combineNewFeeds(state.captures, action.captures, !0),
            totalCaptures: action.totalCaptures
        });

    case GET_BINARIES:
        return state;

    case RECEIVE_BINARIES:
        return Object.assign({}, state, {
            binaries: combineNewFeeds(state.binaries, action.binaries)
        });

    default:
        return state;
    }
};

export default mainReducer;
