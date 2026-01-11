# B2 Clips Chrome Extension

AI-powered web clipping extension for capturing and organizing web content.

## Features

- 📎 **Quick Clipping**: Save selected text or entire pages with one click
- 📝 **Add Notes**: Attach your thoughts and context to each clip
- 🎯 **Context Menu**: Right-click to save selections
- 💾 **API Integration**: Sends clips to backend for AI classification

## Development

### Build Extension

```bash
pnpm build
```

This creates a production build in the `dist/` directory.

### Development Mode

```bash
pnpm dev
```

Watches for file changes and rebuilds automatically.

### Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist/` directory from this extension folder

## Usage

1. **Via Popup**: Click the extension icon and fill in details
2. **Via Context Menu**: Right-click selected text → "Save to B2 Clips"
3. **Add Notes**: Optionally add your own notes before saving

## File Structure

```
chrome-extension/
├── src/
│   ├── popup.html       # Extension popup UI
│   ├── popup.ts         # Popup logic
│   ├── background.ts    # Service worker (background tasks)
│   └── content.ts       # Content script (runs on web pages)
├── public/
│   └── icons/           # Extension icons
├── manifest.json        # Chrome extension manifest (V3)
├── vite.config.ts       # Build configuration
└── package.json         # Dependencies
```

## Requirements

- Backend API running on `http://localhost:3000`
- Chrome/Edge browser (Manifest V3 compatible)

## Notes

- The extension requires the API server to be running to save clips
- Currently configured for development (localhost:3000)
- For production, update the API_URL in `popup.ts` and `host_permissions` in `manifest.json`
