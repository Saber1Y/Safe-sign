import { SCANNER_URL } from "./config";

interface Detection {
  hasSuspiciousText: boolean;
  foundKeywords: string[];
  hexCandidates: string[];
  pageUrl: string;
  pageTitle: string;
}

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function render(detection: Detection | null): void {
  const statusEl = $("status");
  const riskEl = $("risk");
  const detailsEl = $("details");
  const scannerLink = $("scannerLink") as HTMLAnchorElement | null;

  if (!detection) {
    if (statusEl) statusEl.textContent = "Scanning page...";
    if (riskEl) riskEl.style.display = "none";
    if (detailsEl) detailsEl.innerHTML = "<p class='muted'>No data detected yet.</p>";
    return;
  }

  if (statusEl) {
    statusEl.textContent = detection.hasSuspiciousText
      ? "Risk detected"
      : "Page looks clean";
    statusEl.className = detection.hasSuspiciousText ? "status-badge warn" : "status-badge safe";
  }

  if (riskEl) {
    riskEl.style.display = detection.hasSuspiciousText ? "block" : "none";
  }

  if (scannerLink) {
    const params = new URLSearchParams();
    params.set("intent", detection.pageTitle || "unknown");
    const hex = detection.hexCandidates?.[0];
    if (hex) params.set("data", hex);
    scannerLink.href = `${SCANNER_URL}?${params.toString()}`;
  }

  if (detailsEl) {
    const parts: string[] = [];
    if (detection.foundKeywords.length > 0) {
      parts.push(
        `<p><strong>Suspicious keywords:</strong> ${detection.foundKeywords.join(", ")}</p>`,
      );
    }
    if (detection.hexCandidates.length > 0) {
      parts.push(
        `<p><strong>Hex data found:</strong> ${detection.hexCandidates.length} candidate(s)</p>`,
      );
      parts.push(
        `<div class="hex-list">${detection.hexCandidates
          .slice(0, 3)
          .map((h) => `<code>${h.slice(0, 20)}...</code>`)
          .join("")}</div>`,
      );
    }
    if (parts.length === 0) {
      parts.push("<p class='muted'>No transaction data or keywords detected on this page.</p>");
    }
    detailsEl.innerHTML = parts.join("");
  }
}

(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab?.id) return;

  try {
    const detection = await chrome.runtime.sendMessage({
      type: "SAFE_SIGN_GET_STATE",
      tabId: tab.id,
    });
    render(detection as Detection | null);
  } catch {
    render(null);
  }

  $("openScanner")?.addEventListener("click", () => {
    chrome.tabs.create({ url: SCANNER_URL });
  });
})();
