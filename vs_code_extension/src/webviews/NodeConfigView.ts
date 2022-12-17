import * as vscode from 'vscode';

export class NodeConfigView {

	private static readonly VIEW_TYPE = "pyrsia.node-config";

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView(NodeConfigView.VIEW_TYPE, { treeDataProvider: new NodeConfigTreeProvider(), showCollapseAll: true });

		context.subscriptions.push(view);
		// vscode.commands.registerCommand('testView.reveal', async () => {
		// 	const key = await vscode.window.showInputBox({ placeHolder: 'Type the label of the item to reveal' });
		// 	if (key) {
		// 		await view.reveal({ key }, { focus: true, select: false, expand: true });
		// 	}
		// });
		// vscode.commands.registerCommand('testView.changeTitle', async () => {
		// 	const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View', placeHolder: view.title });
		// 	if (title) {
		// 		view.title = title;
		// 	}
		// });
	}
}

class NodeConfigTreeProvider implements vscode.TreeDataProvider<string> {

	private readonly nodeHostnameTreeItem = 
		new NodeTreeItem('Node Hostname',
						   vscode.TreeItemCollapsibleState.None,
						   'node-hostanme');

	getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem>  {
		let treeItem: NodeTreeItem;
		switch (element) {
			case this.nodeHostnameTreeItem.id: {
				return this.nodeHostnameTreeItem;
			}
		}

		throw new Error(`Element ${element} not found.`);
	}

	getChildren(element?: string | undefined): vscode.ProviderResult<string[]> {
		return [this.nodeHostnameTreeItem.id];
	}
}

class NodeTreeItem extends vscode.TreeItem {
	constructor(
	  public readonly label: string,
	  public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	  public readonly id: string
	) {
	  super(label, collapsibleState);
	  this.tooltip = this.label;
	}  
}