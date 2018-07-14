import Express from 'express';
import elastic from 'elasticsearch';

import mainConfig from '../../config.json';

class WebServer {
    constructor() {
        this.port = mainConfig.webui.port || 3000;

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
                from: req.params.from,
                size: 50
            }).then(feeds => {
                res.send(feeds);
            });
        });

        this.server.get('/captures/', (req, res) => {
            res.set('Access-Control-Allow-Origin', '*');

            this.searchES({
                query: {
                    bool: {
                        must: [{
                            match: {
                                connection_channel: 'dionaea.capture'
                            }
                        }, {
                            regexp: {
                                url: '.+'
                            }
                        }]
                    }
                },
                size: 25
            }).then(captures => {
                res.send(captures);
            });
        });

        this.server.get('/binaries/', (req, res) => {
            res.set('Access-Control-Allow-Origin', '*');

            this.searchES({
                query: {
                    term: {
                        connection_channel: 'mwbinary.dionaea.sensorunique'
                    }
                },
                size: 250
            }).then(binaries => {
                res.send(binaries);
            });
        });

        this.server.listen(this.port, () => {
            console.log(`WebServer started listing on port ${this.port}`);
        });
    }
}

export default WebServer;
