# 製品仕様書: AI ウェブクリッピング レビューアシスタント (B2 Clips)

## 1. 目的
この製品は、AI支援による分類とレビューを通じて、保存したウェブクリップから価値を再発見することをユーザーに提供します。
ユーザーデータを自動的に再編成または削除することはありません。

## 2. スコープ内
- ウェブクリッピング用Chrome拡張機能
- AIベースの分類（JSON出力）
- トピッククラスタリングと週次レビュー
- 読み取り専用MCPストレージアクセス
- レビューUI（トピック / 要レビュー）

## 3. スコープ外
- モバイルアプリ
- 自動削除または自動再編成
- 書き込み可能なMCPツール
- ソーシャル / 共有機能

## 4. コアモジュール
1. クリッパー（Chrome拡張機能）
2. 取り込みAPI
3. AI分類器
4. ストレージ + MCPサーバー
5. レビューUI

## 5. データ契約
### 5.1 ClipPayload
```json
{
  "url": "",
  "title": "",
  "domain": "",
  "selected_text": "",
  "user_note": "",
  "captured_at": ""
}
```

### 5.2 ClipRecord
```json
{
  "clip_id": "",
  "topic_tags": [],
  "content_type": "",
  "summary": "",
  "confidence": 0.0,
  "needs_review": false
}
```

## 6. AI分類ルール
- 最大3つのtopic_tags
- content_type ∈ [insight, how-to, news, reference]
- needs_review = true（confidence < 0.7の場合）
- AIはユーザーコンテンツを削除または上書きしない

## 7. MCPツール（読み取り専用）
- search_clips(query, tags, date_range)
- get_clip(clip_id)
- list_topics()
- weekly_review_source(week)

## 8. UXの原則
- ユーザーは生のストレージを開く必要がない
- レビューはトピックと週次レビューを通じて提示される
- AI分類の修正は1つのアクションで完了する必要がある

## 9. 非目標
- 完璧な分類
- MVP段階での全文インデックス化
- AIによる自律的意思決定
