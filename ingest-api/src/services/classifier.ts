import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import type { ClipPayload, ClassificationResult } from 'shared';

class ClassifierService {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private aiProvider: string;
  private aiModel: string;

  constructor() {
    this.aiProvider = process.env.AI_PROVIDER || 'anthropic';
    this.aiModel = process.env.AI_MODEL || 'claude-3-5-sonnet-20241022';

    // Initialize AI client based on provider | プロバイダーに基づいてAIクライアントを初期化
    if (this.aiProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      console.log(`AI Classifier initialized: Anthropic ${this.aiModel}`);
    } else if (this.aiProvider === 'openai' && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log(`AI Classifier initialized: OpenAI ${this.aiModel}`);
    } else {
      console.warn('⚠️  No AI API key found - using mock classification');
      console.warn('   Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env file');
    }
  }

  async classify(payload: ClipPayload): Promise<ClassificationResult> {
    if (this.anthropic || this.openai) {
      return this.classifyWithAI(payload);
    } else {
      return this.classifyMock(payload);
    }
  }

  private async classifyWithAI(payload: ClipPayload): Promise<ClassificationResult> {
    console.log('🤖 Classifying with AI...');

    try {
      const prompt = this.buildPrompt(payload);

      let responseText = '';

      if (this.anthropic) {
        const message = await this.anthropic.messages.create({
          model: this.aiModel,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        });
        responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      } else if (this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: this.aiModel,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });
        responseText = completion.choices[0]?.message?.content || '';
      }

      const result = this.parseAIResponse(responseText);

      console.log(`✓ AI Classification complete`);
      console.log(`  Topics: ${result.topic_tags.join(', ')}`);
      console.log(`  Type: ${result.content_type}`);
      console.log(`  Confidence: ${result.confidence}`);

      return result;
    } catch (error) {
      console.error('❌ AI classification failed, falling back to mock:', error);
      return this.classifyMock(payload);
    }
  }

  private buildPrompt(payload: ClipPayload): string {
    return `You are a content classification assistant. Analyze the following web clip and provide a JSON response with classification details.

**Web Clip Details:**
- Title: ${payload.title}
- URL: ${payload.url}
- Domain: ${payload.domain}
- Selected Text: ${payload.selected_text || '(none)'}
- User Note: ${payload.user_note || '(none)'}

**Classification Rules:**
1. Generate up to 3 relevant topic tags (lowercase, hyphenated)
2. Classify content type as one of: insight, how-to, news, reference
3. Provide a brief 1-2 sentence summary (max 150 chars)
4. Assign confidence score 0.0-1.0 based on content clarity
5. Set needs_review=true if confidence < 0.7

**Response Format (JSON only, no markdown):**
{
  "topic_tags": ["tag1", "tag2", "tag3"],
  "content_type": "insight|how-to|news|reference",
  "summary": "Brief summary here...",
  "confidence": 0.85,
  "needs_review": false
}`;
  }

  private parseAIResponse(response: string): ClassificationResult {
    try {
      // Remove markdown code blocks if present | マークダウンコードブロックが存在する場合は削除
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Validate and sanitize | 検証とサニタイズ
      return {
        topic_tags: (parsed.topic_tags || ['general']).slice(0, 3),
        content_type: ['insight', 'how-to', 'news', 'reference'].includes(parsed.content_type)
          ? parsed.content_type
          : 'reference',
        summary: (parsed.summary || '').substring(0, 150),
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        needs_review: parsed.needs_review ?? (parsed.confidence < 0.7),
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw error;
    }
  }

  private classifyMock(payload: ClipPayload): ClassificationResult {
    console.log('Using mock classification...');

    const text = `${payload.title} ${payload.selected_text} ${payload.user_note}`.toLowerCase();
    const topicTags: string[] = [];

    if (text.includes('code') || text.includes('programming') || text.includes('javascript') || text.includes('python')) {
      topicTags.push('programming');
    }
    if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
      topicTags.push('design');
    }
    if (text.includes('ai') || text.includes('machine learning') || text.includes('llm')) {
      topicTags.push('ai');
    }

    if (topicTags.length === 0) {
      topicTags.push('general');
    }

    let contentType: 'insight' | 'how-to' | 'news' | 'reference' = 'reference';
    if (text.includes('how to') || text.includes('tutorial')) {
      contentType = 'how-to';
    } else if (text.includes('news') || text.includes('announced')) {
      contentType = 'news';
    }

    const confidence = 0.75 + Math.random() * 0.2;
    const summary = (payload.selected_text || payload.title).substring(0, 150).trim();

    return {
      topic_tags: topicTags.slice(0, 3),
      content_type: contentType,
      summary: summary || 'No summary available',
      confidence: parseFloat(confidence.toFixed(2)),
      needs_review: confidence < 0.7,
    };
  }
}

export const classifierService = new ClassifierService();
