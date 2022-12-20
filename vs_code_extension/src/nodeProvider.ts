import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as client from './utilities/client';

export class NodeProvider {

    nodeProcess: cp.ChildProcess;
    pid: number | undefined;

    async isNodeHealthy() : Promise<boolean> {
        return await client.isNodeHealthy();
    }

    getHostname() : String {
        return client.getNodeUrl();
    }

    async getStatus() : Promise<unknown> {
        let nodeStatus = await client.getStatus();
        
        return nodeStatus;
    }
        
    // async start() {
        
    //     this.pid = this.nodeProcess.pid;
    //     console.log(this.pid);
    //     vscode.window.showInformationMessage('Pyrsia Node Started');
    //     if (!await client.isNodeHealty()) {
            
    //     }
    // }

    // stop() {
    //     this.nodeProcess.kill();
    //     console.log(this.pid);
    //     vscode.window.showInformationMessage('Pyrsia Node Stopped');
    // }
}