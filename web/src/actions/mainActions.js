export const GET_FEEDS = 'GET_FEEDS';
export const getFeeds = () => {
    return function (dispatch) {
        return fetch('http://192.168.1.34:3000/search/')
            .then(
                response => response.json(),
                error => console.log(error)
            ).then(json =>
                dispatch(receiveFeeds(json))
            );
    };
};

export const RECEIVE_FEEDS = 'RECEIVE_FEEDS';
export const receiveFeeds = feeds => {
    return {
        type: RECEIVE_FEEDS,
        feeds: feeds.hits.hits,
        totalFeeds: feeds.hits.total
    };
};

export const GET_CAPTURES = 'GET_CAPTURES';
export const getCaptures = () => {
    return function (dispatch) {
        return fetch('http://192.168.1.34:3000/captures/')
            .then(
                response => response.json(),
                error => console.log(error)
            ).then(json => {
                return dispatch(receiveCaptures(json));
            }).catch(error => {
                console.log(error);
            });
    };
};

export const RECEIVE_CAPTURES = 'RECEIVE_CAPTURES';
export const receiveCaptures = captures => {
    return {
        type: RECEIVE_CAPTURES,
        captures: captures.hits.hits,
        totalCaptures: captures.hits.total
    };
};
