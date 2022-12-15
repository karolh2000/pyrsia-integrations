const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const nodeConnectButton = document.getElementById("node-button-connect");
  nodeConnectButton.addEventListener("click", updateNode);
  nodeConnectButton.style.color = newColor;
}

function updateNode() {
  vscode.postMessage({
    command: "node-updatate-view",
  });
}

window.addEventListener('message', event => {
  const message = event.data; // The json data that the extension sent
  switch (message.type) {
      case 'node-disconnected':
        {
          document.getElementById("node-connected").style.display = "none";
          document.getElementById("node-disconnected").style.display = "block";
          break;
        }
      case 'node-connected':
        {
          document.getElementById("node-connected").style.display = "block";
          document.getElementById("node-disconnected").style.display = "none";
          break;
        }
  }
});