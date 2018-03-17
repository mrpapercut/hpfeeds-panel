import elasticsearch from 'elasticsearch';

const getFeeds = () => {
    const esclient = new elasticsearch.Client({
        host: 'http://localhost:9200',
        httpAuth: 'elastic:elastic'
    });

    esclient.search({
        index: 'hpfeeds',
        body: {
            'sort': [{'timestamp': 'desc'}]
        }
    }).then(res => {
        console.log(res.hits.hits);
    });
};

// module.exports = getFeeds;
getFeeds();
