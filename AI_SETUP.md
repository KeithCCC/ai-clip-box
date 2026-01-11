# ステップ5: AI統合セットアップ

## AI分類を有効にするには:

1. **Anthropic APIキーを取得:**
   - アクセス: https://console.anthropic.com/
   - サインアップまたはログイン
   - API Keysに移動
   - 新しいAPIキーを作成

2. **APIキーを`.env`ファイルに追加:**
   - ルートディレクトリの`.env`を開く
   - `your_anthropic_key_here`を実際のAPIキーに置き換える:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
   ```

3. **サーバーを再起動:**
   ```bash
   pnpm --filter ingest-api dev
   ```

## 代替: OpenAIを使用

OpenAIを使用する場合:
1. APIキーを取得: https://platform.openai.com/api-keys
2. `.env`に設定:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   AI_PROVIDER=openai
   AI_MODEL=gpt-4o
   ```

## AI分類をテスト

APIキーを追加してサーバーを再起動後:
1. Chrome拡張機能を開く
2. 任意のウェブページでテキストを選択
3. クリップを保存
4. ターミナルでAI分類結果を確認！

AIはコンテンツを分析して以下を生成します:
- インテリジェントなトピックタグ
- コンテンツタイプの分類
- 意味のある要約
- 信頼度スコア
- レビュー推奨
