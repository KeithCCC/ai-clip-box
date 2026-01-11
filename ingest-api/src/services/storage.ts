import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ClipRecord } from 'shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
  private storagePath: string;
  private clipsFile: string;

  constructor() {
    this.storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../../storage');
    this.clipsFile = path.join(this.storagePath, 'clips.json');
  }

  async initialize(): Promise<void> {
    try {
      // Create storage directory if it doesn't exist | ストレージディレクトリが存在しなければ作成
      await fs.mkdir(this.storagePath, { recursive: true });

      // Create clips file if it doesn't exist | クリップファイルが存在しなければ作成
      try {
        await fs.access(this.clipsFile);
      } catch {
        await fs.writeFile(this.clipsFile, JSON.stringify([], null, 2));
        console.log('Created clips.json');
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  async saveClip(clip: ClipRecord): Promise<void> {
    try {
      const clips = await this.getAllClips();
      clips.push(clip);
      await fs.writeFile(this.clipsFile, JSON.stringify(clips, null, 2));
    } catch (error) {
      console.error('Failed to save clip:', error);
      throw error;
    }
  }

  async getAllClips(): Promise<ClipRecord[]> {
    try {
      const data = await fs.readFile(this.clipsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read clips:', error);
      return [];
    }
  }

  async getClip(clipId: string): Promise<ClipRecord | null> {
    const clips = await this.getAllClips();
    return clips.find(c => c.clip_id === clipId) || null;
  }

  async getClipsByTopic(topic: string): Promise<ClipRecord[]> {
    const clips = await this.getAllClips();
    return clips.filter(c => c.topic_tags.includes(topic));
  }

  async getClipsNeedingReview(): Promise<ClipRecord[]> {
    const clips = await this.getAllClips();
    return clips.filter(c => c.needs_review);
  }
}

export const storageService = new StorageService();
