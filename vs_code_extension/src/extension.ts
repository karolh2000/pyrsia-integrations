import * as vscode from 'vscode';
import { NodeProvider } from './nodeProvider';
import { NodeConfigView } from './webviews/NodeConfigView';
import { NodeViewProvider } from './webviews/NodeViewProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Pyrsia extencion activated');

	new NodeViewProvider(context);
	new NodeConfigView(context);
	
	// let startNode = vscode.commands.registerCommand('pyrsia.isNodeHealthy', () => {
	// 	nodeProvider.isNodeHealthy;
	// });

	// let stopNode = vscode.commands.registerCommand('pyrsia.stopNode', () => {
	// 	nodeProvider.stop();
	// });

	// context.subscriptions.push(startNode, stopNode);
}

export function deactivate() {}

