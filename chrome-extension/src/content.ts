// Content script that runs on all web pages | すべてのウェブページで実行されるコンテンツスクリプト

console.log('B2 Clips content script loaded');

// Listen for messages from popup | ポップアップからのメッセージをリスン
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSelection') {
    // Get current selection when requested | リクエストされたら現在の選択範囲を取得
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    
    console.log('Selection requested, returning:', selectedText.substring(0, 50));
    sendResponse({ selection: selectedText });
  }
  return true; // Keep the message channel open for async response
});

export {};
