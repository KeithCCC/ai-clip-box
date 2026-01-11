import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { ClipPayload, ClipRecord } from 'shared';
import { storageService } from '../services/storage.js';
import { classifierService } from '../services/classifier.js';

export const clipRouter = Router();

// POST /api/clips - Save a new clip | POST /api/clips - 新しいクリップを保存
clipRouter.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body as ClipPayload;

    // Validate payload | ペイロードを検証
    if (!payload.url || !payload.title) {
      return res.status(400).json({
        error: 'Invalid payload',
        message: 'URL and title are required',
      });
    }

    // Generate clip ID | クリップIDを生成
    const clipId = uuidv4();

    console.log(`Saving clip: ${clipId} - ${payload.title}`);

    // Classify the clip using AI (async, non-blocking) | AIを使ってクリップを分類（非同期、ノンブロッキング）
    const classification = await classifierService.classify(payload);

    // Create clip record | クリップレコードを作成
    const clip: ClipRecord = {
      clip_id: clipId,
      ...payload,
      ...classification,
      classified_at: new Date().toISOString(),
    };

    // Save to storage | ストレージに保存
    await storageService.saveClip(clip);

    console.log(`✓ Clip saved: ${clipId}`);
    console.log(`  Topics: ${clip.topic_tags.join(', ')}`);
    console.log(`  Type: ${clip.content_type}`);
    console.log(`  Confidence: ${clip.confidence}`);

    res.status(201).json({
      success: true,
      clip_id: clipId,
      classification: {
        topic_tags: clip.topic_tags,
        content_type: clip.content_type,
        confidence: clip.confidence,
        needs_review: clip.needs_review,
      },
    });
  } catch (error) {
    console.error('Error saving clip:', error);
    res.status(500).json({
      error: 'Failed to save clip',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/clips - List all clips | GET /api/clips - 全クリップをリスト
clipRouter.get('/', async (req: Request, res: Response) => {
  try {
    const clips = await storageService.getAllClips();
    res.json({
      success: true,
      count: clips.length,
      clips,
    });
  } catch (error) {
    console.error('Error fetching clips:', error);
    res.status(500).json({
      error: 'Failed to fetch clips',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/clips/:id - Get a single clip | GET /api/clips/:id - 単一のクリップを取得
clipRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const clip = await storageService.getClip(req.params.id);
    
    if (!clip) {
      return res.status(404).json({
        error: 'Clip not found',
      });
    }

    res.json({
      success: true,
      clip,
    });
  } catch (error) {
    console.error('Error fetching clip:', error);
    res.status(500).json({
      error: 'Failed to fetch clip',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
