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
              <div> 🟢 Connected to Pyrsia node</div>
            </div>
            <div id="node-disconnected">
              <p> 🔴 Faild to connect to Pyrsia node</p>
              <p><a title="Pyrsia help and troubleshooting..." href="https://pyrsia.io/docs/tutorials/quick-installation/">Pyrsia help and troubleshooting...</a></p>
              <button id="node-button-connect">Refresh</button>
              </div>
            <p></p>
            <table>
            <tbody>
            <tr>
            <td >Hostname:</td>
            <td >&nbsp;</td>
            </tr>
            <tr>
            <td >Port:</td>
            <td >&nbsp;</td>
            </tr>
            <tr>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            </tr>
            <tr>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            </tr>
            <tr>
            <td >&nbsp;</td>
            <td >&nbsp;</td>
            </tr>
            </tbody>
            </table>
          </div>
				</body>
			</html>
		`;
  }

  private  _setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      const command = message.command;
      switch (command) {
        case "node-updatate-view":
          let connected: boolean = await this.nodeProvider.isNodeHealthy();
          if (connected) {
            this.connected();
          } else {
            this.disconnected();
          }
          break;
      }
    });
  }

  private connected() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'node-connected' });
    }
  }

  private disconnected() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'node-disconnected' });
    }
  }

}
