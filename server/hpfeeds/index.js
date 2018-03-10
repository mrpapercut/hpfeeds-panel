var put = require('put');
var binary = require('binary');
var S = require('string');
var net = require('net');
var hexdump = require('hexdump-nodejs');
var crypto = require('crypto'), shasum = crypto.createHash('sha1');
var spawn = require('child_process').spawn;

var getGeodata = require('../util/getGeodata');

var len, type, lenIdent, lenChannel = 0, serverName, nonce;

var identifier = "HPFeedsNodeJSServer"
var payload, authHash, channel;

var clients = [];
var img = [];
var bytes;

var port = 10000;
var verbose = true;
var useews = false;
var useredis = false;

class HPFeedsServer {
    constructor(port, verbose) {
        this.port = port || 10000;
        this.verbose = verbose || false;

        this.createServer();
    }

    createServer() {
        // Start a TCP Server
        net.createServer(socket => {
            // Identify this client
            socket.name = socket.remoteAddress + ":" + socket.remotePort

            // create initial packet from server with none
            var publishLen = 4 + 1 + 1 + S(identifier).length + 4;

            var pubBuf = put()
                .word32be(publishLen)                 //
                .word8(1)                             // INFO PACKET
                .word8(S(identifier).length)          // LENGTH IDENTIFIER
                .put(new Buffer(identifier, 'ascii')) // IDENTIFIER
                .word32be(0x42424242)                 // NONCE
                .buffer();

            socket.write(pubBuf);

            // Handle incoming messages from clients.
            socket.on('data', data => {
                img.push(data);
                this.parseBuf(data);

                if (this.verbose) console.log("Recieved " + data.length + " bytes....")
            });

            // Remove the client from the list when it leaves
            socket.on('end', () => {
                clients.splice(clients.indexOf(socket), 1);
                bytes = Buffer.concat(img);

                console.log('Event `end` received');
                this.parseBuf(bytes);
            });
        }).listen(port);

        // Put a friendly message on the terminal of the server.
        console.log("HPFeedsServer started listening at port " + port);
    }

    parseBuf(bytes) {
        var lenCompletePacket = bytes.byteLength;
        var byteRunner = 0;
        var self = this;

        binary.parse(bytes).tap(function (vars2) {
            while (byteRunner <= lenCompletePacket - 1) {
                if (self.verbose) console.log("Starting scan loop at offset " + byteRunner + " from total length  " + lenCompletePacket);

                this.word32bu('len');
                this.word8bu('type');
                this.word8bu('lenIdent');

                this.tap(function (vars) {
                    this.buffer('identifier', vars.lenIdent);

                    identifier = vars.identifier;
                    lenIdent = vars.lenIdent;
                    type = vars.type;

                    // check for AUTH packet
                    if (vars.type == 2) {
                        this.buffer('authHash', 20)
                        authHash = vars.authHash
                        byteRunner += 6 + 20 + vars.lenIdent
                        this.flush()
                    }
                    // check for PUBLISH packet
                    else if (vars.type == 3) {
                        this.word8bu('lenChannel')

                        var lenChannelPlain = vars.lenChannel.toString();
                        var lenChannel = vars.lenChannel.toString().charCodeAt(0);

                        this.buffer('channel', vars.lenChannel);

                        var lenPayload = vars.len - 4 - 1 - 1 - vars.lenIdent - 1 - vars.lenChannel;

                        this.buffer('payload', lenPayload);

                        channel = vars.channel;
                        payload = vars.payload;
                        len = vars.len;

                        byteRunner += 6 + vars.lenIdent + 1 + lenChannel + lenPayload

                        if (useews) ewsParser.parseEWS(payload, useredis, self.verbose, true, false)     // for the moment use only xml parser and no json parser
                    } else {
                        if (self.verbose) console.log("Error: Unknown packet found: " + bytes)
                        byteRunner = lenCompletePacket
                    }

                    if (type == 2) {
                        if (self.verbose) console.log("Auth packet with identifier: " + identifier.toString() + " and hash")
                        if (self.verbose) console.log(hexdump(authHash))
                    }

                    if (type == 3) {
                        if (self.verbose) console.log("   Publish packet with channel: " + channel.toString() + " and identifier " + identifier.toString() + " and len " + len.toString() + " and payload " + payload.toString())
                        if (self.verbose) console.log(hexdump(payload));
                        
                        if (channel.toString() === 'dionaea.connections') {
                            self.processPayload(JSON.parse(payload.toString('utf8')), channel.toString(), identifier.toString());
                        } else if (channel.toString() === 'dionaea.capture') {
                            self.processPayload(JSON.parse(payload.toString('utf8')), channel.toString(), identifier.toString());
                        } else if (channel.toString() === 'mwbinary.dionaea.sensorunique') {
                            if (self.verbose) console.log('caught something, ', payload.toString('utf8').length, 'bytes');
                        }
                    }
                })
            }
        })
    }

    processPayload(payload, channel, identifier) {
        if (channel === 'dionaea.capture') payload = this.formatPayload(payload);

        payload = Object.assign(payload, {
            connection_channel: channel,
            timestamp: +new Date(),
            sensor: identifier
        });

        this.addGeodata(payload).then(payload => this.curlPayload(payload));
    }

    formatPayload(payload) {
        return {
            remote_port: parseInt(payload.sport, 10),
            remote_host: payload.saddr,
            local_port: payload.dport,
            local_host: payload.daddr,
            url: payload.url
        };
    }

    addGeodata(payload) {
        return new Promise((resolve, reject) => {
            getGeodata(payload.remote_host, geodata => {
                payload = Object.assign(payload, {
                    coordinates: [geodata.latitude, geodata.longitude],
                    longitude: geodata.longitude,
                    latitude: geodata.latitude,
                    city: geodata.fqcn
                });

                resolve(payload);
            });
        });
    }
    
    curlPayload(payload) {    
        const curlrequest = spawn('curl', [
            '--user', 'elastic:elastic',
            '-X', 'POST', 'http://localhost:9200/hpfeeds/feed',
            '-H', 'Content-Type: application/json',
            '-d', JSON.stringify(payload)
        ]);
        
        curlrequest.stdout.on('data', data => {
            // if (this.verbose) console.log(`stdout: ${data}`);
        });
        
        curlrequest.stderr.on('data', err => {
            // if (this.verbose) console.log(`stderr: ${err}`);
        });
        
        curlrequest.on('close', exitcode => {
            if (this.verbose) console.log(`curl closed with exitcode ${exitcode}`);
        });
    }
}

module.exports = HPFeedsServer;
