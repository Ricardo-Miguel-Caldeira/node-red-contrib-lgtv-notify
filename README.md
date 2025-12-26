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
[inject] → [lgtv-notify]
```

Set `msg.payload` to your notification message:

```javascript
msg.payload = "Someone is at the front door!";
return msg;
```

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

## License

MIT

## Credits

Built on [lgtv2](https://github.com/hobbyquaker/lgtv2) by Sebastian Raff.
