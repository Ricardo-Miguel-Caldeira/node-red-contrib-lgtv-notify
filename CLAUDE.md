# YouTube Enhanced - webOS TV App

Based on [youtube-webos](https://github.com/webosbrew/youtube-webos) with custom modifications for larger TVs.

## App Info
- **App ID**: `com.mysmartv.youtube`
- **Title**: YouTube Enhanced
- **Features**: Ad blocking, SponsorBlock, smaller thumbnails (5 per row)

## Project Structure
```
/home/rcaldeira/mySmartTV-Youtube/
├── assets/
│   └── appinfo.json          # App manifest (custom ID)
├── src/
│   ├── index.html            # Entry point
│   ├── index.js              # Redirects to youtube.com/tv
│   ├── userScript.ts         # Main injection script
│   ├── thumbnail-size.css    # Custom CSS for smaller thumbnails
│   ├── adblock.js            # Ad blocking
│   ├── sponsorblock.js       # SponsorBlock integration
│   └── ...                   # Other modules
├── dist/                     # Build output
└── com.mysmartv.youtube_1.0.0_all.ipk
```

## Development Commands

### Build
```bash
npm run build
```

### Package
```bash
npx ares-package dist/ --outdir .
```

### Install to TV
```bash
npx ares-install com.mysmartv.youtube_1.0.0_all.ipk -d webostv
```

### Launch
```bash
npx ares-launch com.mysmartv.youtube -d webostv
```

### Full Deploy (one command)
```bash
npm run build && npx ares-package dist/ --outdir . && npx ares-install com.mysmartv.youtube_1.0.0_all.ipk -d webostv && npx ares-launch com.mysmartv.youtube -d webostv
```

## Preview Method (Remote Debugging)

### 1. Start Inspector
```bash
npx ares-inspect com.mysmartv.youtube -d webostv
```

Output:
```
Application Debugging - http://localhost:XXXXX
```

### 2. Open in Browser
1. Navigate to `http://localhost:XXXXX`
2. Click on "YouTube na TV" link
3. DevTools opens with live screencast of the TV

### 3. Take Screenshot with Playwright
```javascript
await page.goto('http://localhost:XXXXX');
await page.click('text=YouTube na TV');
await page.waitForTimeout(3000);
await page.screenshot({ path: 'tv-preview.png' });
```

## Custom Thumbnail CSS

The `src/thumbnail-size.css` uses CSS transforms to scale down content:
- Scales browse content to 85%
- Scales individual tiles to 82%
- Compacts sidebar to give more content space
- Results in ~5 thumbnails per row on large TVs

## TV Device
- **Name**: webostv
- **IP**: 10.1.60.87:9922

### List Devices
```bash
npx ares-setup-device --list
```

## Notes
- App coexists with official YouTube (different app ID)
- All youtube-webos features enabled (ad blocking, SponsorBlock)
- CSS may need fine-tuning based on specific TV size
