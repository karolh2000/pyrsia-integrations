import * as vscode from 'vscode';
import { NodeProvider } from './nodeProvider';
import { NodeConfigView } from './webviews/NodeConfigView';
import { NodeViewProvider } from './webviews/NodeViewProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Pyrsia extension activated');

	const nodeView = new NodeViewProvider(context);
	const nodeConfigView = new NodeConfigView(context);

	// TODO notify the Node Config View when connected to node
	nodeView.onDidConnect(() => {
		nodeConfigView.update();
	});

	
	// let startNode = vscode.commands.registerCommand('pyrsia.isNodeHealthy', () => {
	// 	nodeProvider.isNodeHealthy;
	// });

	// let stopNode = vscode.commands.registerCommand('pyrsia.stopNode', () => {
	// 	nodeProvider.stop();
	// });

	// context.subscriptions.push(startNode, stopNode);
}

export function deactivate() {}

