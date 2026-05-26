const scannerUrl = "http://localhost:3000/scanner";
const openScanner = document.getElementById("openScanner");
const riskBox = document.getElementById("risk");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0]?.url ?? "";
  if (
    currentUrl.toLowerCase().includes("claim") ||
    currentUrl.toLowerCase().includes("reward")
  ) {
    riskBox.style.display = "block";
  }
});

openScanner?.addEventListener("click", () => {
  chrome.tabs.create({ url: scannerUrl });
});

