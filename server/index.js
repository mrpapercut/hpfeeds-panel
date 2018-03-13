import HPFeedsServer from './hpfeeds/';
import WebServer from './web/';

const args = process.argv.slice(2);
let verbose = false;

if (args.length > 0) {
    args.forEach(arg => {
        switch(arg) {
            case '--verbose':
                verbose = true;
                break;
        }
    })
}

export default class StartServers {
    constructor() {
        this.hpfeedsServer = new HPFeedsServer(verbose);
        this.webServer = new WebServer();
    }
}
