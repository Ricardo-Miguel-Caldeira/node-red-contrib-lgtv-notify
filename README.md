# node-red-contrib-lgtv-notify

Send toast notifications to LG webOS Smart TVs from Node-RED.

**Works with webOS 10+ (2025 TVs)** - Includes built-in SSL handling for newer TV firmware.

## Features

- Simple toast notifications on your LG TV
- Works with webOS 3.0 and newer (including 2025 models)
- Automatic SSL certificate handling (no manual configuration needed)
- Auto-reconnection and message queuing
- Saves pairing key for seamless future connections

## Installation

### From Node-RED Palette Manager

1. Open Node-RED
2. Go to Menu > Manage palette > Install
3. Search for `node-red-contrib-lgtv-notify`
4. Click Install

### From Command Line

```bash
cd ~/.node-red
npm install node-red-contrib-lgtv-notify
```

Then restart Node-RED.

## Setup

1. Drag an **LG TV notify** node onto your flow
2. Double-click to configure
3. Add a new TV configuration with your TV's IP address
4. Deploy
5. **Important:** Check your TV for a pairing prompt and accept it

After accepting the pairing prompt once, the node will remember the connection key.

## Usage

### Basic Example

```
[inject] → [lgtv-notify] → [debug]
```

Set `msg.payload` to your notification message:

```javascript
msg.payload = "Someone is at the front door!";
return msg;
```

### Example Flow

Import this flow into Node-RED (Menu → Import):

```json
[{"id":"a1b2c3d4","type":"inject","name":"Send Notification","props":[{"p":"payload"}],"payload":"Hello from Node-RED!","payloadType":"str","repeat":"","crontab":"","once":false,"x":160,"y":100,"wires":[["e5f6g7h8"]]},{"id":"e5f6g7h8","type":"lgtv-notify","name":"LG TV","tv":"","message":"","x":370,"y":100,"wires":[["i9j0k1l2"]]},{"id":"i9j0k1l2","type":"debug","name":"Response","active":true,"tosidebar":true,"complete":"true","x":540,"y":100,"wires":[]}]
```

1. Import the flow above
2. Double-click the "LG TV" node and configure your TV's IP address
3. Deploy
4. Accept the pairing prompt on your TV
5. Click the inject button to send a notification

### Home Automation Example

```
[mqtt in] → [function] → [lgtv-notify]
doorbell      format
```

Function node:
```javascript
msg.payload = "Doorbell: " + msg.payload;
return msg;
```

## Requirements

- LG webOS Smart TV (webOS 3.0 or newer)
- TV and Node-RED on the same network
- "LG Connect Apps" enabled on the TV
  - Settings > General > External Device Manager > LG Connect Apps

## Troubleshooting

### TV not connecting

1. Make sure the TV is powered on (not in standby)
2. Check that "LG Connect Apps" is enabled
3. Verify the IP address is correct
4. The TV takes ~25 seconds after power-on before the API is available

### Pairing prompt not appearing

- Restart Node-RED and redeploy the flow
- Try removing and re-adding the TV configuration

### Notifications not showing

- Notifications only appear when the TV is on and displaying content
- Maximum message length is 60 characters

## Support

If you find this useful, consider buying me a coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/rcaldeira)

## License

MIT

## Credits

Built on [lgtv2](https://github.com/hobbyquaker/lgtv2) by Sebastian Raff.
