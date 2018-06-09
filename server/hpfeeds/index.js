import path         from 'path';
import fs           from 'fs';
import put          from 'put';
import binary       from 'binary';
import S            from 'string';
import net          from 'net';
import hexdump      from 'hexdump-nodejs';
import {spawn}      from 'child_process';

import getGeodata   from '../util/getGeodata';
import md5sum       from '../util/md5sum';
import {
    logError,
    logInfo
} from '../util/log';

import mainConfig   from '../../config.json';

let identifier = 'HPFeedsNodeJSServer';

const clients = [];
const img = [];

class HPFeedsServer {
    constructor(verbose) {
        this.verbose = verbose || false;
        this.port    = mainConfig.receiver.port || 10000;

        // Vars
        this.lenIdent = null;

        this.createServer();
    }

    hexdump(val) {
        let dump = '';

        try {
            dump = hexdump(val);
        } catch (e) {
            dump = 'Unable to hexdump';
        }

        return dump;
    }

    createServer() {
        // Start a TCP Server
        net.createServer(socket => {
            // Identify this client
            socket.name = `${socket.remoteAddress}:${socket.remotePort}`;

            // create initial packet from server with none
            var publishLen = 4 + 1 + 1 + S(identifier).length + 4;

            var pubBuf = put()
                .word32be(publishLen)                   //
                .word8(1)                               // INFO PACKET
                .word8(S(identifier).length)            // LENGTH IDENTIFIER
                .put(Buffer.from(identifier, 'ascii'))  // IDENTIFIER
                .word32be(0x42424242)                   // NONCE
                .buffer();

            socket.write(pubBuf);

            // Handle incoming messages from clients.
            socket.on('data', data => {
                img.push(data);
                this.parseBuf(data);
            });

            // Remove the client from the list when it leaves
            socket.on('end', () => {
                clients.splice(clients.indexOf(socket), 1);
                logInfo('Event `end` received');

                this.parseBuf(Buffer.concat(img));
            });
        }).listen(this.port);

        // Put a friendly message on the terminal of the server.
        console.log(`HPFeedsServer started listening at port ${this.port}`);
    }

    parseBuf(bytes) {
        var lenCompletePacket = bytes.byteLength;
        var byteRunner = 0;
        var self = this;

        binary.parse(bytes).tap(function(vars2) {
            while (byteRunner <= lenCompletePacket - 1) {
                if (self.verbose) logInfo(`Starting scan loop at offset ${byteRunner} from total length ${lenCompletePacket}`);

                this.word32bu('len');
                this.word8bu('type');
                this.word8bu('lenIdent');

                this.tap(function (vars) {
                    this.buffer('identifier', vars.lenIdent);

                    this.lenIdent = vars.lenIdent;

                    /* types:
                      2 AUTH packet
                      3 PUBLISH packet
                    */
                    if (vars.type === 2) {
                        this.buffer('authHash', 20);
                        byteRunner += 6 + 20 + vars.lenIdent;
                        this.flush();

                        if (self.verbose) {
                            logInfo(`Auth packet with identifier: ${vars.identifier.toString()} and hash`, this.hexdump(vars.authHash));
                        }
                    } else if (vars.type === 3) {
                        this.word8bu('lenChannel');

                        let lenChannel = vars.lenChannel.toString().charCodeAt(0);
                        this.buffer('channel', vars.lenChannel);

                        let lenPayload = vars.len - 4 - 1 - 1 - vars.lenIdent - 1 - vars.lenChannel;
                        this.buffer('payload', lenPayload);

                        byteRunner += 6 + vars.lenIdent + 1 + lenChannel + lenPayload;

                        const {channel, payload, identifier, len} = vars;

                        if (self.verbose) {
                            logInfo(
                                `Publish packet`,
                                ` channel: ${channel.toString()}`,
                                ` identifier: ${identifier.toString()}`,
                                ` len: ${len.toString()}`,
                                ` payload: ${this.hexdump(payload)}`
                            );
                        }

                        // Process payload
                        switch (channel.toString()) {
                        case 'dionaea.connections':
                        case 'dionaea.capture':
                            self.processPayload(payload.toString('utf8'), channel.toString(), identifier.toString());
                            break;
                        case 'mwbinary.dionaea.sensorunique':
                            self.savePayloadToFile(payload);
                            if (self.verbose) logError(`caught something: ${payload.toString('utf8').length} bytes`, this.hexdump(payload));
                            break;
                        }
                    } else { // Likely when local port 10000 is hit directly
                        if (self.verbose) logError(`Error: Unknown packet found: \n${this.hexdump(bytes)}`);
                        byteRunner = lenCompletePacket;
                    }
                });
            }
        });
    }

    processPayload(payload, channel, identifier) {
        try {
            payload = JSON.parse(payload);
        } catch (e) {
            logError(`Error trying to process payload:`, this.hexdump(payload));
            return;
        }

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

    savePayloadToFile(payload) {
        const payloadsDirectory = path.resolve(path.join('.', '/payloads/'));
        const payloadhash = md5sum(payload);

        fs.lstat(payloadsDirectory, (err, res) => {
            if (err) {
                fs.mkdir(payloadsDirectory, (err, res) => {
                    if (err) {
                        logError('Error creating directory `payloads`');
                    } else {
                        fs.writeFile(path.join(payloadsDirectory, `${payloadhash}.bin`), payload, (err, res) => {
                            if (err) logError(`Could not write payload ${payloadhash}`);
                        });
                    }
                });
            } else {
                fs.writeFile(path.join(payloadsDirectory, `${payloadhash}.bin`), payload, (err, res) => {
                    if (err) logError(`Could not write payload ${payloadhash}`);
                });
            }
        });
    }

    addGeodata(payload) {
        return new Promise((resolve, reject) => {
            getGeodata(payload.remote_host, (err, geodata) => {
                if (err) logError(err);

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

        curlrequest.stderr.on('data', data => {
            // if (this.verbose) console.log(`stderr: ${data}`);
        });

        curlrequest.on('close', exitcode => {
            // if (this.verbose) console.log(`curl closed with exitcode ${exitcode}`);
        });
    }
}

module.exports = HPFeedsServer;
