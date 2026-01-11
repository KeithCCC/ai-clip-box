import type { ClipPayload } from '@shared/types';

interface PageData {
  title: string;
  url: string;
  domain: string;
  selectedText: string;
}

let currentPageData: PageData | null = null;

// Get current tab and page info | 現在のタブとページ情報を取得
async function getCurrentPageData(): Promise<PageData> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.id || !tab.url || !tab.title) {
    throw new Error('Unable to access current tab');
  }

  // Get selected text from content script | コンテンツスクリプトから選択テキストを取得
  let selectedText = '';
  try {
    // Inject content script if needed (for already-open tabs) | 必要に応じてコンテンツスクリプトを注入（既に開いているタブ用）
    await chrome.scripting.executeScript{
      target: { tabId: tab.id },
      files: ['src/content.js']
    }).catch(() => {
      // Ignore if already injected | 既に注入済みの場合は無視
    });

    // Small delay to ensure content script is ready | コンテンツスクリプトの準備完了を待つための短い遅延
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelection' });
    selectedText = response?.selection || '';
    console.log('Got selection:', selectedText);
  } catch (error) {
    console.warn('Could not get selection from content script:', error);
  }

  const url = new URL(tab.url);
  
  return {
    title: tab.title,
    url: tab.url,
    domain: url.hostname,
    selectedText: selectedText.trim(),
  };
}

// Display page information | ページ情報を表示
function displayPageInfo(data: PageData) {
  const titleEl = document.getElementById('pageTitle');
  const urlEl = document.getElementById('pageUrl');
  const selectedEl = document.getElementById('selectedText');

  if (titleEl) titleEl.textContent = data.title;
  if (urlEl) urlEl.textContent = data.url;
  
  if (selectedEl) {
    if (data.selectedText) {
      selectedEl.textContent = data.selectedText;
      selectedEl.style.fontStyle = 'normal';
    } else {
      selectedEl.innerHTML = '<em>No text selected</em>';
      selectedEl.style.fontStyle = 'italic';
    }
  }
}

// Show status message | ステータスメッセージを表示
function showStatus(message: string, type: 'success' | 'error' | 'info') {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';

  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// Save clip to API | クリップをAPIに保存
async function saveClip(payload: ClipPayload): Promise<void> {
  const API_URL = 'http://localhost:3000/api/clips';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Clip saved:', result);
  } catch (error) {
    console.error('Failed to save clip:', error);
    throw new Error('Could not connect to API. Make sure the server is running.');
  }
}

// Handle form submission | フォーム送信を処理
async function handleSubmit(event: Event) {
  event.preventDefault();

  if (!currentPageData) {
    showStatus('Page data not loaded', 'error');
    return;
  }

  const userNoteEl = document.getElementById('userNote') as HTMLTextAreaElement;
  const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;

  const userNote = userNoteEl?.value.trim() || '';

  // Disable button during save | 保存中はボタンを無効化
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '💾 Saving...';
  }

  try {
    const payload: ClipPayload = {
      url: currentPageData.url,
      title: currentPageData.title,
      domain: currentPageData.domain,
      selected_text: currentPageData.selectedText,
      user_note: userNote,
      captured_at: new Date().toISOString(),
    };

    await saveClip(payload);
    
    showStatus('✓ Clip saved successfully!', 'success');
    
    // Clear form | フォームをクリア
    if (userNoteEl) userNoteEl.value = '';
    
    // Close popup after short delay | 短い遅延後にポップアップを閉じる
    setTimeout(() => {
      window.close();
    }, 1500);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save clip';
    showStatus(message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Save Clip';
    }
  }
}

// Initialize popup | ポップアップを初期化
async function init() {
  try {
    currentPageData = await getCurrentPageData();
    displayPageInfo(currentPageData);
  } catch (error) {
    console.error('Failed to load page data:', error);
    showStatus('Unable to load page information', 'error');
  }

  // Setup form handler | フォームハンドラーをセットアップ
  const form = document.getElementById('clipForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

// Run on load | ロード時に実行
init();
