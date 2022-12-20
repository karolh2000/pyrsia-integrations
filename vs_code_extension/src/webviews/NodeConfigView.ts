import * as vscode from 'vscode';
import * as util from '../utilities/util';
import * as client from '../utilities/client';

export class NodeConfigView {

	private static readonly VIEW_TYPE = "pyrsia.node-config";

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView(NodeConfigView.VIEW_TYPE, { treeDataProvider: new NodeConfigTreeProvider(), showCollapseAll: true });

		context.subscriptions.push(view);
	}
}

enum NodeConfigProperty {
	Hostname = "hostname",
	Port = "port",
	HostnameValue = "hostnamevalue",
	PortValue = "portvalue",
	Peers = "peers",
	PeersValue = "peersvalue",
};

class NodeConfigTreeProvider implements vscode.TreeDataProvider<string> {

	private treeItems: Map<string, NodeTreeItem>  = new Map<string, NodeTreeItem>();

	getTreeItem(id: string): vscode.TreeItem | Thenable<vscode.TreeItem>  {
		let treeItem = this.treeItems.get(id);
		if (!treeItem) {
			return new vscode.TreeItem("Empty");
		}
		
		return treeItem;
	}

	getChildren(parentId?: string | undefined): vscode.ProviderResult<string[]> {
		let childrenArray: string[] = [];
		if (!parentId) { // Create all tree Items for the tree
			for (let nodeProperty in NodeConfigProperty) { // TODO Why nodeProperty is 'string' type? Investigate
				const treeItem = this.treeItems.get(nodeProperty);
				if (treeItem) {
					treeItem.update();
				} else {
					const enumType = NodeConfigProperty[nodeProperty as keyof typeof NodeConfigProperty]; // TODO Why I have to do this conversion in TS? Shouldn't 'nodeProperty' be the enum type?
					this.treeItems.set(nodeProperty.toLocaleLowerCase(), NodeTreeItem.create(enumType)); // TODO Why I have to do this conversion in TS? Shouldn't 'nodeProperty' be the enum type?
				}
			}
			childrenArray = [... this.treeItems].map(([key, value]) => {
				return value.isRoot() ? value.id : "";
			}).filter(value => value != "");
		} else { // not tree root then get the particular id for the parentId
			const childId = NodeTreeItem.getChildrenId(parentId);
			const treeItem : NodeTreeItem = this.treeItems.get(childId) as NodeTreeItem;
			childrenArray = [treeItem.id];
		}

		return childrenArray;
	}

	getParent(element: string): vscode.ProviderResult<string> {
		return "test";
	}
}

class NodeTreeItem extends vscode.TreeItem {

	constructor(
	  public readonly label: string,
	  public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	  public readonly id: string,
	  public readonly root: boolean,
	) {
	  super(label, collapsibleState);
	  this.tooltip = this.label;
	}

	static create(nodeProperty: NodeConfigProperty) : NodeTreeItem {
		const property = this.Properties[nodeProperty];
		const collapsibleState = property.root ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
		return new NodeTreeItem(
			property.name,
			collapsibleState,
			property.id,
			property.root,
		);
	}

	update() {
		console.error("NOT IMPLEMENTED YET");
	}

	isRoot(): boolean {
		return this.root;
	}

	static getChildrenId(parentId: string) {
		return `${parentId}value`;
	}

	private static readonly Properties = {
		[NodeConfigProperty.Hostname.toLowerCase()]: {
			name: "Hostname",
			id: "hostname", // NO I18
			root: true,
		},[NodeConfigProperty.HostnameValue.toLowerCase()]: {
			name: "Getting node hostname...",
			id: "hostnamevalue", // NO I18
			root: false,
		},
		[NodeConfigProperty.Port.toLowerCase()]: {
			name: "Port",
			id: "port", // NO I18
			root: true,
		},
		[NodeConfigProperty.PortValue.toLowerCase()]: {
			name: "Getting node port...",
			id: "portvalue", // NO I18
			root: false,
		},
		[NodeConfigProperty.Peers.toLowerCase()]: {
			name: "Peers",
			id: "peers", // NO I18
			root: true,
		},
		[NodeConfigProperty.PeersValue.toLowerCase()]: {
			name: async (treeItem: NodeTreeItem) :Promise<any> => {
				return await client.getPeers();
			},
			id: "peersvalue", // NO I18
			root: false,
		},
	};
}