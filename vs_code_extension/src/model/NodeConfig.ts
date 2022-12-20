export class NodeConfig {
	private static readonly DEFAULT_HOSTNAME = 'localhost';
	private static readonly DEFAULT_PORT = 7888;

	private _hostname: string;
	private _port: number;
	private _peers: number;

	constructor(hostname: string = NodeConfig.DEFAULT_HOSTNAME, port: number = NodeConfig.DEFAULT_PORT) {
		this._hostname = hostname;
		this._port = port;
	}
	
	get hostname(): string {
		return this._hostname;
	}

	set hostname(hostname: string) {
		this._hostname = hostname;
	}

	get port(): number {
		return this.port;
	}

	set port(port: number) {
		this._port = port;
	}
}