// Background service worker for B2 Clips extension | B2 Clipsエクステンションのバックグラウンドサービスワーカー

console.log('B2 Clips background service worker loaded');

// Create context menu on install | インストール時にコンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-clips',
    title: 'Save to B2 Clips',
    contexts: ['selection', 'page'],
  });

  console.log('B2 Clips extension installed');
});

// Handle context menu clicks | コンテキストメニューのクリックを処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-to-clips' && tab?.id) {
    // Open popup when context menu is clicked | コンテキストメニューがクリックされたらポップアップを開く
    chrome.action.openPopup();
  }
});

// Handle messages from content scripts or popup | コンテンツスクリプトまたはポップアップからのメッセージを処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.action === 'clipSaved') {
    // Show notification when clip is saved | クリップが保存されたら通知を表示
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'B2 Clips',
      message: 'Clip saved successfully!',
    });
  }

  return true;
});

// Badge text for development | 開発用のバッジテキスト
chrome.action.setBadgeText({ text: 'DEV' });
chrome.action.setBadgeBackgroundColor({ color: '#667eea' });

export {};
