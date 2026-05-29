import { SCANNER_URL, SUSPICIOUS_KEYWORDS } from "./config";

interface Detection {
  hasSuspiciousText: boolean;
  foundKeywords: string[];
  hexCandidates: string[];
  pageUrl: string;
  pageTitle: string;
}

type TabState = {
  detection: Detection | null;
};

const tabStates = new Map<number, TabState>();

function getState(tabId: number): TabState {
  let state = tabStates.get(tabId);
  if (!state) {
    state = { detection: null };
    tabStates.set(tabId, state);
  }
  return state;
}

function updateBadge(tabId: number): void {
  const state = getState(tabId);
  if (state.detection?.hasSuspiciousText) {
    chrome.action.setBadgeText({ text: "!", tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#b91c1c", tabId });
  } else {
    chrome.action.setBadgeText({ text: "", tabId });
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "SAFE_SIGN_DETECT" && sender.tab?.id) {
    const tabId = sender.tab.id;
    const state = getState(tabId);
    state.detection = message.payload as Detection;
    updateBadge(tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "SAFE_SIGN_GET_STATE" && sender.tab?.id) {
    const state = getState(sender.tab.id);
    sendResponse(state.detection);
  }
  return true;
});

chrome.contextMenus.create({
  id: "scan-with-safesign",
  title: "Scan with SafeSign",
  contexts: ["selection", "page"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan-with-safesign") {
    let params = "";
    if (info.selectionText) {
      const text = info.selectionText.trim();
      if (text.startsWith("0x")) {
        params = `?data=${encodeURIComponent(text)}`;
      }
    }
    if (tab?.url) {
      const url = new URL(tab.url);
      params += `${params ? "&" : "?"}intent=${encodeURIComponent(url.hostname)}`;
    }
    chrome.tabs.create({ url: `${SCANNER_URL}${params}` });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});
