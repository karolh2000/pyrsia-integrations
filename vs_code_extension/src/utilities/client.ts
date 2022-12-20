import axios from "axios";
import * as util from "./util";

// TODO This should be obtained from the pyrsia node config
export function getNodeUrl() : String {
    return `http://${util.getNodeConfig().hostname}:${getNodePort()}`;
}

// TODO This should be obtained from the pyrsia node config
function getNodePort() : number {
    return util.getNodeConfig().port;
}

type PingResponse = {
    data: String[];
};

type StatusResponse = {
  data: String[];
};

export async function isNodeHealty(): Promise<boolean> {
    console.log('Check node health');
    const nodeUrl = `${getNodeUrl()}/v2`;
    let status;    
    try {
        ({ status } = await axios.get<PingResponse>(
        nodeUrl,
        {
          headers: {
            accept: 'application/json',
          },
        },
      ));
    } catch (e) {
        console.error(e);
    }

    return status === 200;
}

export async function getStatus(): Promise<unknown> {
  console.log('Get node status');
  const nodeUrl = `${getNodeUrl()}/status`;  
  let data;
  
  try {
      ({ data } = await axios.get<StatusResponse>(
      nodeUrl,
      {
        headers: {
          accept: 'application/json',
        },
      },
    ));
  } catch (e) {
      console.error(e);
  }

  return data;
}

export async function getPeers(): Promise<unknown> {
  console.log('Get node peers');

  return (await getStatus() as any).peers_count;
}