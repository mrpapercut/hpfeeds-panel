import Express from 'express';
import elastic from 'elasticsearch';

class WebServer {
    constructor() {
        this.server = new Express();
        this.esclient = new elastic.Client({
            httpAuth: 'elastic:elastic',
            host: 'http://localhost:9200'
        });

        this.startListening();
    }

    searchES(body) {
        return this.esclient.search({
            index: 'hpfeeds',
            body: Object.assign({
                sort: [{
                    timestamp: 'desc'
                }]
            }, body)
        });
    }

    startListening() {
        this.server.get('/search/:from(\\d+)?', (req, res) => {
            res.set('Access-Control-Allow-Origin', '*');

            this.searchES({
                from: req.params.from
            }).then(feeds => {
                res.send(feeds);
            });
        });

        this.server.get('/captures/', (req, res) => {
            res.set('Access-Control-Allow-Origin', '*');

            this.searchES({
                query: {
                    term: {
                        connection_channel: 'dionaea.capture'
                    }
                },
                size: 200
            }).then(captures => {
                res.send(captures);
            });
        });

        this.server.listen(3000, () => {
            console.log('WebServer started listing on port 3000');
        });
    }
}

export default WebServer;
