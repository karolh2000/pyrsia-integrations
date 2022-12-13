import * as cp from 'child_process';
import * as vscode from 'vscode';

export class NodeProvider {

    nodeProcess: cp.ChildProcess;
    pid: number | undefined;
        
    start() {
        this.nodeProcess = cp.spawn("/home/karolh/trunk/pyrsia/bin/node/pyrsia_node");
        this.pid = this.nodeProcess.pid;
        console.log(this.pid);
        vscode.window.showInformationMessage('Pyrsia Node Started');
    }

    stop() {
        this.nodeProcess.kill();
        console.log(this.pid);
        vscode.window.showInformationMessage('Pyrsia Node Stopped');
    }
}