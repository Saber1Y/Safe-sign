const suspiciousKeywords = ["claim", "reward", "airdrop"];
const pageText = document.body?.innerText?.toLowerCase() ?? "";
const foundSuspiciousKeyword = suspiciousKeywords.some((keyword) =>
  pageText.includes(keyword),
);

if (foundSuspiciousKeyword) {
  chrome.runtime.sendMessage({
    type: "SAFE_SIGN_SUSPICIOUS_PAGE",
    payload: {
      url: window.location.href,
    },
  });
}

