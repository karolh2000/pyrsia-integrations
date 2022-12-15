import axios from 'axios';

// TODO This should be obtained from the pyrsia node config
function getNodeUrl() : String {
    return "http://localhost";
}

// TODO This should be obtained from the pyrsia node config
function getNodePort() : String {
    return "7888";
}

type PingResponse = {
    data: String[];
};

export async function isNodeHealty(): Promise<boolean> {
    console.log('Ping node');
    const nodeUrl = `${getNodeUrl()}:${getNodePort()}/status`;
    console.log(nodeUrl);
    
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