import * as vscode from 'vscode';
import { NodeProvider } from './nodeProvider';
import { NodeViewProvider } from './webviews/NodeViewProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Pyrsia extencion activated');

	const nodeProvider = new NodeProvider();
	const provider = new NodeViewProvider(context.extensionUri, nodeProvider);

	const nodeViewDisposable = vscode.window.registerWebviewViewProvider(
		NodeViewProvider.viewType,
		provider
	);
	
	let startNode = vscode.commands.registerCommand('pyrsia.startNode', () => {
		nodeProvider.start();
		

	});

	let stopNode = vscode.commands.registerCommand('pyrsia.stopNode', () => {
		nodeProvider.stop();
	});

	context.subscriptions.push(startNode, stopNode);
}

export function deactivate() {}

