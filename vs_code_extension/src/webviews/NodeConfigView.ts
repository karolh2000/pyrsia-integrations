import * as vscode from 'vscode';
import * as util from '../utilities/util';
import * as client from '../utilities/client';

export class NodeConfigView {

	private static readonly VIEW_TYPE = "pyrsia.node-config";

	constructor(context: vscode.ExtensionContext) {
		const treeViewProvider = new NodeConfigTreeProvider();
		const view = vscode.window.createTreeView(NodeConfigView.VIEW_TYPE, { treeDataProvider: treeViewProvider, showCollapseAll: true });
		vscode.window.registerTreeDataProvider(NodeConfigView.VIEW_TYPE, treeViewProvider);

		// setup: events
        view.onDidChangeSelection(e => {
            console.log(e); // breakpoint here for debug
        });

        view.onDidCollapseElement(e => {
            console.log(e); // breakpoint here for debug
        });

        view.onDidChangeVisibility(e => {
            console.log(e); // breakpoint here for debug
        });
		
        view.onDidExpandElement(e => {
            console.log(e); // breakpoint here for debug
        });




		context.subscriptions.push(view);

		vscode.commands.registerCommand('pyrsia.node-config.tree.refresh', () => {
			treeViewProvider.refresh();
		});

		view.onDidChangeVisibility(() => {
			treeViewProvider.refresh();
		});

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

	private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> = this._onDidChangeTreeData.event;

	private treeItems: Map<string, NodeTreeItem>  = new Map<string, NodeTreeItem>();

	async refresh() {
		for (let nodeProperty in NodeConfigProperty) { // TODO Why nodeProperty is 'string' type? Investigate
			const treeItem = this.treeItems.get(nodeProperty.toLocaleLowerCase());
			if (treeItem) {
				await treeItem.update();
			}
		}

		this._onDidChangeTreeData.fire();
	}

	getTreeItem(id: string): vscode.TreeItem | Thenable<vscode.TreeItem>  {
		let treeItem = this.treeItems.get(id);
		if (!treeItem) {
			throw new Error(`Tree item ${id} doesn't exist.`);
		}
		
		return treeItem;
	}

	getChildren(parentId?: string | undefined): vscode.ProviderResult<string[]> {
		let childrenArray: string[] = [];
		if (!parentId) { // Create all tree Items for the tree
			for (let nodeProperty in NodeConfigProperty) { // TODO Why nodeProperty is 'string' type? Investigate
				const treeItem = this.treeItems.get(nodeProperty.toLowerCase());
				if (!treeItem) {
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
}

class NodeTreeItem extends vscode.TreeItem {

	constructor(
	  public label: string,
	  public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	  public readonly id: string,
	  public readonly root: boolean,
	  private readonly updateCallback: Function,
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
			property.update,
		);
	}

	async update() {
		await this.updateCallback(this);
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
			update: async () => {
				console.log(`Nothing to update - ${this.name}`);
			},
		},[NodeConfigProperty.HostnameValue.toLowerCase()]: {
			name: "Getting node hostname...",
			id: "hostnamevalue", // NO I18
			root: false,
			update: async (treeItem: NodeTreeItem) => {
				treeItem.label = util.getNodeConfig().hostname;
			},
		},
		[NodeConfigProperty.Port.toLowerCase()]: {
			name: "Port",
			id: "port", // NO I18
			root: true,
			update: async () => {
				console.log(`Nothing to update - ${this.name}`);
			},
		},
		[NodeConfigProperty.PortValue.toLowerCase()]: {
			name: "Getting node port...",
			id: "portvalue", // NO I18
			root: false,
			update: async (treeItem: NodeTreeItem) => {
				treeItem.label = util.getNodeConfig().port;
			},
		},
		[NodeConfigProperty.Peers.toLowerCase()]: {
			name: "Peers",
			id: "peers", // NO I18
			root: true,
			update: async (treeItem: NodeTreeItem) => {
				console.log(`Nothing to update - ${this.name}`);
			},
		},
		[NodeConfigProperty.PeersValue.toLowerCase()]: {
			name: "Getting node peers...",
			id: "peersvalue", // NO I18
			root: false,
			update: async (treeItem: NodeTreeItem) => {
				const peers: any = await client.getPeers();
				treeItem.label = peers.toString();
				treeItem.tooltip = peers.toString();
				console.log(`Updating - ${this.name}`);
			},
		},
	};
}