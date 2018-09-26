import mainConfig from '../../../config.json';

const webuiurl = `${mainConfig.webui.host}:${mainConfig.webui.port}`;

export const GET_FEEDS = 'GET_FEEDS';
export const getFeeds = () => {
    return function (dispatch) {
        return fetch(`${webuiurl}/search/`)
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
        return fetch(`${webuiurl}/captures/`)
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

export const GET_BINARIES = 'GET_BINARIES';
export const getBinaries = () => {
    return function(dispatch) {
        return fetch(`${webuiurl}/binaries/`)
            .then(
                response => response.json(),
                error => console.log(error)
            ).then(json => {
                return dispatch(receiveBinaries(json));
            }).catch(error => {
                console.log(error);
            });
    };
};

export const RECEIVE_BINARIES = 'RECEIVE_BINARIES';
export const receiveBinaries = binaries => {
    return {
        type: RECEIVE_BINARIES,
        binaries: binaries.hits.hits
    };
};
