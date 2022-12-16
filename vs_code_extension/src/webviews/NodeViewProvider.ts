import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { NodeProvider } from "../nodeProvider";
import { getUri } from "../utilities/util";

export class NodeViewProvider implements WebviewViewProvider {
  public static readonly viewType = "pyrsia.node";
  private nodeProvider;
  private _view?: WebviewView;
  
  constructor(private readonly _extensionUri: Uri, nodeProvider: NodeProvider) {
    this.nodeProvider = nodeProvider;
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;
    // Allow scripts in the webview
    webviewView.webview.options = {
      enableScripts: true,
    };

    // Set the HTML content that will fill the webview view
    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

    // Sets up an event listener to listen for messages passed from the webview view context
    // and executes code based on the message that is recieved
    this._setWebviewMessageListener(webviewView);

    webviewView.onDidChangeVisibility((e) => {
      this.updateView();
    });

    this.updateView();    
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const toolkitUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode",
      "webview-ui-toolkit",
      "dist",
      "toolkit.js",
    ]);
    const mainUri = getUri(webview, extensionUri, ["src", "webview-ui", "main.js"]);
    const stylesUri = getUri(webview, extensionUri, ["src", "webview-ui", "styles.css"]);

    const pyrsiaHostname = this.nodeProvider.getHostname();

    return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<script type="module" src="${toolkitUri}"></script>
					<script type="module" src="${mainUri}"></script>
					<link rel="stylesheet" href="${stylesUri}">
					<title>Node</title>
				</head>
				<body>
          <div id="node-container">
            <div id="node-connected">
            <div>🟢 Connected to Pyrsia node</div>
            <hr>
            <div>
              <div class="dimmer">Node Hostname: <b><a href="${pyrsiaHostname}/status">${pyrsiaHostname}</a></b></div>
              <div class="dimmer">Node Peers: <b><a href="${pyrsiaHostname}/peers"><span id="node-peer-count"></span></a></b></div>
          </div>
        
            <!--
            <div><a title="Troubleshooting..." href="https://pyrsia.io/docs/tutorials/quick-installation/"> 🌐 Help and troubleshooting...</a></div>
            <p>Peer Count</p>
            <p id="node-peer-count"></p>
            <p>Peer ID</p>
            <p id="node-peer-id"></p>
            <p>Peer Addresses</p>
            <p id="node-peer-addresses"></p>
            -->
            </div>
           
            <div id="node-disconnected">
              <div> 🔴 Faild to connect to Pyrsia node❗</div>
              <hr>
              <div class="dimmer">Node Hostname: <a href="${pyrsiaHostname}/status">${pyrsiaHostname}</a></div>
              <div class="break"></div>
              <div>👉 Please make sure Pyrsia is <a title="How to install pyrsia" href="https://pyrsia.io/docs/tutorials/quick-installation/"> installed</a>, 
                <a title="How to start pyrsia node" href="https://pyrsia.io/docs/tutorials/quick-installation/"> running</a> and <a title="Update Pyrsia configuration" href=""> configured.</a>. 👈
              </div>
              <div class="break"></div>
              <button id="node-button-connect">Refresh</button>
            </div>
            
          </div>
				</body>
			</html>
		`;
  }

  private  _setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      const command = message.command;
      switch (command) {
        case "node-updatate-view": {
          this.updateView();
        }
      }
    });
  }

  private connected() {
    const view = this._view;
    if (view) {
      let nodeStatus: unknown;
      this.nodeProvider.getStatus().then((data) => {
        nodeStatus = data;
      }).finally(() => {
        view.webview.postMessage({ type: 'node-connected', nodeStatus});
      });
    }
  }

  private disconnected() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'node-disconnected' });
    }
  }

  private async updateView() {
    let connected: boolean = await this.nodeProvider.isNodeHealthy();
    if (connected) {
      this.connected();
    } else {
      this.disconnected();
    }
  }

  private updateNodeStatus() {
    
  }

}
