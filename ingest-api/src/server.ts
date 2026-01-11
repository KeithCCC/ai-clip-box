import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clipRouter } from './routes/clips.js';
import { storageService } from './services/storage.js';

// Load environment variables | 環境変数を読み込み
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware | ミドルウェア
app.use(cors({
  origin: ['chrome-extension://*', 'http://localhost:*'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging | リクエストログ
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check | ヘルスチェック
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes | APIルート
app.use('/api/clips', clipRouter);

// Error handling | エラーハンドリング
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Initialize storage | ストレージを初期化
async function initServer() {
  try {
    await storageService.initialize();
    console.log('Storage initialized');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   B2 Clips Ingest API Server          ║
║   Running on http://localhost:${PORT}   ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initServer();
