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
}

export const RECEIVE_FEEDS = 'RECEIVE_FEEDS';
export const receiveFeeds = feeds => {
    return {
        type: RECEIVE_FEEDS,
        feeds: feeds.hits.hits,
        total: feeds.hits.total
    };
}