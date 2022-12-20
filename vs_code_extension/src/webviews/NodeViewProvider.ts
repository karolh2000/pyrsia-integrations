import * as vscode from 'vscode';
import { NodeProvider } from "../nodeProvider";
import { getUri } from "../utilities/util";

export class NodeViewProvider implements vscode.WebviewViewProvider {
  public static readonly VIEW_TYPE = "pyrsia.node";

  private nodeProvider;
  private _view?: vscode.WebviewView;
  private extensionUri: vscode.Uri;
  private readonly onDidConnectListeners: Set<Function> = new Set<Function>();


  constructor(private readonly context: vscode.ExtensionContext) {
    this.nodeProvider = new NodeProvider();

    vscode.window.registerWebviewViewProvider(
      NodeViewProvider.VIEW_TYPE,
      this,
    );

    this.extensionUri = context.extensionUri;
  }

  public getWebView(): vscode.WebviewView {
    return this._view as vscode.WebviewView;
  }

  onDidConnect(listener: Function): void {
		this.onDidConnectListeners.add(listener);
	}

  public resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = view;
    
    view.webview.options = {
      enableScripts: true,
    };

    view.webview.html = this.getWebviewContent(view.webview, this.extensionUri);
    this.setWebviewMessageListener(view);

    view.onDidChangeVisibility((e) => {
      this.updateView();
    });

    this.updateView();
  }

  private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    
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
              <div id="node-connected" none>
                  <div>🟢 Connected to <b><a href="${pyrsiaHostname}/status">${pyrsiaHostname}</a></b></div>
              </div>

              <div id="node-disconnected">
                  <div>🔴 Failed connecting to <b><a href="${pyrsiaHostname}/status">${pyrsiaHostname}</a></b></div>
                  <div class="break"></div>
                  <div>👉 Please make sure Pyrsia is <a title="How to install pyrsia"
                          href="https://pyrsia.io/docs/tutorials/quick-installation/"> installed</a>,
                      <a title="How to start pyrsia node" href="https://pyrsia.io/docs/tutorials/quick-installation/">
                          running</a> and <a title="Update Pyrsia configuration" href=""> configured.</a>. 👈
                  </div>
                  <div class="break"></div>
                  <button id="node-button-connect">Connect</button>
              </div>

          </div>
      </body>

      </html>
		`;
  }

  private setWebviewMessageListener(view: vscode.WebviewView) {
    view.webview.onDidReceiveMessage(async (message) => {
      const command = message.command;
      switch (command) {
        case "node-update-view": {
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
        view.webview.postMessage({ type: 'node-connected', nodeStatus });
        for (const listener of this.onDidConnectListeners) {
          listener();
        }
      });
    }
  }

  private disconnected() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'node-disconnected' });
    }
    for (const listener of this.onDidConnectListeners) {
      listener();
    }
  }

  public async updateView() {
    let connected: boolean = await this.nodeProvider.isNodeHealthy();
    if (connected) {
      this.connected();
    } else {
      this.disconnected();
    }
  }
}
