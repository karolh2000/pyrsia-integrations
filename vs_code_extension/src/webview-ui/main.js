const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

// Main function that gets executed once the webview DOM loads
function main() {
  const nodeButton = document.getElementById("node-button");
  nodeButton.addEventListener("click", updateNode);
}

function updateNode() {
  vscode.postMessage({
    command: "node-update",
  });
}