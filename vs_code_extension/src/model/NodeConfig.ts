export class NodeConfig {
	private static readonly DEFAULT_HOSTNAME = "localhost";
	private static readonly DEFAULT_PORT = "7888";

	private _hostname: string;
	private _port: string;

	constructor(hostname: string = NodeConfig.DEFAULT_HOSTNAME, port: string = NodeConfig.DEFAULT_PORT) {
		this._hostname = hostname;
		this._port = port;
	}
	
	get hostname(): string {
		return this._hostname;
	}

	set hostname(hostname: string) {
		this._hostname = hostname;
	}

	get port(): string {
		return this._port;
	}

	set port(port: string) {
		this._port = port;
	}
}