const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const nodeButton = document.getElementById("node-button");
  nodeButton.addEventListener("click", updateNode);
}

function updateNode() {
  vscode.postMessage({
    command: "node-update",
  });
}