import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from "vscode";
import { NodeProvider } from "../nodeProvider";
import { getUri } from "../utilities/getUri";

export class NodeViewProvider implements WebviewViewProvider {
  public static readonly viewType = "pyrsia.node";
  private nodeProvider;

  constructor(private readonly _extensionUri: Uri, nodeProvider: NodeProvider) {
    this.nodeProvider = nodeProvider;
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
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
          <section id="search-container"> 
          </section>
          <vscode-button id="node-button">Start Node</vscode-button>
				</body>
			</html>
		`;
  }

  private _setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      const command = message.command;

      switch (command) {
        case "node-start":
          this.nodeProvider.start();
          break;
      }
    });
  }

}
