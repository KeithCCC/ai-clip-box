// Data types shared across all modules | 全モジュール間で共有されるデータ型

export interface ClipPayload {
  url: string;
  title: string;
  domain: string;
  selected_text: string;
  user_note: string;
  captured_at: string;
}

export interface ClipRecord {
  clip_id: string;
  url: string;
  title: string;
  domain: string;
  selected_text: string;
  user_note: string;
  captured_at: string;
  topic_tags: string[];
  content_type: 'insight' | 'how-to' | 'news' | 'reference';
  summary: string;
  confidence: number;
  needs_review: boolean;
  classified_at?: string;
}

export interface ClassificationResult {
  topic_tags: string[];
  content_type: 'insight' | 'how-to' | 'news' | 'reference';
  summary: string;
  confidence: number;
  needs_review: boolean;
}

export interface SearchQuery {
  query?: string;
  tags?: string[];
  date_range?: {
    start: string;
    end: string;
  };
}

export interface Topic {
  name: string;
  count: number;
}
