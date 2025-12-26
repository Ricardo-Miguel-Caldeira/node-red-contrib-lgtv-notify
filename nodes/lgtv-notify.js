// Disable SSL certificate verification for LG TV's self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = function(RED) {
    const lgtv = require('lgtv2');

    // Configuration node for TV connection
    function LgtvConfigNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.host = config.host;
        this.name = config.name || config.host;
        this.connection = null;
        this.connected = false;
        this.connecting = false;
        this.clientKey = null;
        this.queue = [];

        // Store client key in credentials
        if (this.credentials && this.credentials.clientKey) {
            this.clientKey = this.credentials.clientKey;
        }

        this.connect = function() {
            if (node.connecting || node.connected) return;

            node.connecting = true;

            const options = {
                url: `wss://${node.host}:3001`,
                reconnect: false
            };

            if (node.clientKey) {
                options.clientKey = node.clientKey;
            }

            node.connection = lgtv(options);

            node.connection.on('error', (err) => {
                node.error(`Connection error: ${err.message}`);
                node.warn(`Full error: ${JSON.stringify(err)}`);
                node.connected = false;
                node.connecting = false;
            });

            node.connection.on('close', () => {
                node.connected = false;
                node.connecting = false;
            });

            node.connection.on('prompt', () => {
                node.log('Pairing prompt shown on TV - please accept');
            });

            node.connection.on('connect', () => {
                node.connected = true;
                node.connecting = false;
                node.log(`Connected to TV at ${node.host}`);
                node.warn(`Connection established - clientKey: ${node.connection.clientKey ? 'present' : 'missing'}`);

                // Save client key for future connections
                if (node.connection.clientKey && node.connection.clientKey !== node.clientKey) {
                    node.clientKey = node.connection.clientKey;
                    node.credentials.clientKey = node.clientKey;
                }

                // Process queued messages
                while (node.queue.length > 0) {
                    const msg = node.queue.shift();
                    node.sendToast(msg.message, msg.callback);
                }
            });
        };

        this.disconnect = function() {
            if (node.connection) {
                node.connection.disconnect();
                node.connection = null;
            }
            node.connected = false;
            node.connecting = false;
        };

        this.sendToast = function(message, callback) {
            node.warn(`sendToast called - connected: ${node.connected}, message: "${message}"`);

            if (!node.connected) {
                node.warn(`Not connected, queuing message. Queue size: ${node.queue.length + 1}`);
                node.queue.push({ message, callback });
                node.connect();
                return;
            }

            node.warn(`Sending toast request to TV...`);
            node.connection.request(
                'ssap://system.notifications/createToast',
                { message: message },
                (err, res) => {
                    if (err) {
                        node.error(`Toast request failed: ${err.message || err}`);
                        node.warn(`Full error object: ${JSON.stringify(err)}`);
                    } else {
                        node.warn(`Toast response: ${JSON.stringify(res)}`);
                    }
                    if (callback) callback(err, res);
                }
            );
        };

        this.on('close', function(done) {
            node.disconnect();
            done();
        });
    }

    RED.nodes.registerType('lgtv-config', LgtvConfigNode, {
        credentials: {
            clientKey: { type: 'text' }
        }
    });

    // Notify node
    function LgtvNotifyNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        this.tv = RED.nodes.getNode(config.tv);
        this.name = config.name;

        if (!this.tv) {
            node.error('No TV configured');
            return;
        }

        node.status({ fill: 'grey', shape: 'dot', text: 'idle' });

        this.on('input', function(msg, send, done) {
            const message = msg.payload || config.message || 'Notification';

            node.warn(`Input received - payload type: ${typeof msg.payload}, message to send: "${message}"`);
            node.status({ fill: 'yellow', shape: 'dot', text: 'sending...' });

            node.tv.sendToast(message, (err, res) => {
                node.warn(`Callback received - err: ${err ? JSON.stringify(err) : 'null'}, res: ${JSON.stringify(res)}`);

                if (err) {
                    node.status({ fill: 'red', shape: 'dot', text: 'error' });
                    node.error(`Failed to send toast: ${err.message || JSON.stringify(err)}`, msg);
                    if (done) done(err);
                } else {
                    node.warn(`Toast sent successfully - toastId: ${res ? res.toastId : 'unknown'}`);
                    node.status({ fill: 'green', shape: 'dot', text: 'sent' });
                    msg.toastId = res ? res.toastId : null;
                    msg.tvResponse = res;
                    send(msg);
                    if (done) done();

                    // Reset status after 3 seconds
                    setTimeout(() => {
                        node.status({ fill: 'grey', shape: 'dot', text: 'idle' });
                    }, 3000);
                }
            });
        });

        this.on('close', function() {
            node.status({});
        });
    }

    RED.nodes.registerType('lgtv-notify', LgtvNotifyNode);
};
