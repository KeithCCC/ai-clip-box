# AI Web Clipping Review Assistant (B2 Clips)

AI-powered web clipping tool that helps you rediscover value from saved content through intelligent classification and review workflows.

## Project Structure

```
ai-clip-box/
├── chrome-extension/     # Chrome extension for web clipping
├── ingest-api/          # Backend API server for processing clips
├── ai-classifier/       # AI classification service
├── mcp-server/          # Model Context Protocol server
├── review-ui/           # Web UI for reviewing clips
├── storage/             # Local storage for clips
└── shared/              # Shared types and utilities
```

## Features

- 🔖 **Web Clipping**: Save content from any webpage via Chrome extension
- 🤖 **AI Classification**: Automatic categorization and tagging
- 📊 **Topic Clustering**: Organize clips by topics
- 📅 **Weekly Review**: Structured review workflow
- 🔍 **MCP Integration**: Read-only storage access via Model Context Protocol

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pnpm
- Chrome browser

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

### Development

Run all services:
```bash
# Chrome Extension
pnpm dev:extension

# API Server
pnpm dev:api

# Review UI
pnpm dev:ui
```

## Documentation

See [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) for detailed product specifications.

## License

Private project - All rights reserved
