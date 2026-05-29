import { SUSPICIOUS_KEYWORDS, HEX_PATTERN } from "./config";

interface Detection {
  hasSuspiciousText: boolean;
  foundKeywords: string[];
  hexCandidates: string[];
  pageUrl: string;
  pageTitle: string;
}

function scanPage(): Detection {
  const text = (document.body?.innerText ?? "").toLowerCase();
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => text.includes(kw));
  const hasSuspiciousText = foundKeywords.length > 0;

  const allText = document.body?.innerText ?? "";
  const hexCandidates = [...allText.matchAll(HEX_PATTERN)].map((m) => m[0]).slice(0, 10);

  return {
    hasSuspiciousText,
    foundKeywords,
    hexCandidates,
    pageUrl: window.location.href,
    pageTitle: document.title,
  };
}

function sendDetection(): void {
  const detection = scanPage();
  try {
    chrome.runtime.sendMessage({ type: "SAFE_SIGN_DETECT", payload: detection });
  } catch {
    /* extension context may not be ready yet */
  }
}

sendDetection();

const observer = new MutationObserver(() => {
  sendDetection();
});
observer.observe(document.body, { childList: true, subtree: true });
