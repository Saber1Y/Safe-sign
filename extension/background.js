chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "SAFE_SIGN_SUSPICIOUS_PAGE") {
    console.log("QIE SafeSign suspicious signal:", {
      from: sender.tab?.url,
      payload: message.payload,
    });
  }
});

