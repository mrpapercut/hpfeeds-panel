import HPFeedsServer from './hpfeeds/';
import WebServer from './web/';

export default class StartServers {
    constructor() {
        this.hpfeedsServer = new HPFeedsServer();
        this.webServer = new WebServer();
    }
}
