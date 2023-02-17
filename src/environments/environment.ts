export const environment = {
    production: false,
    hmr: true,
    baseUrl: 'http://localhost:8080',
    getNodeData: '/get-node-data',
    getEdgeData: '/get-edge-data',
    mqtt: {
        server: 'localhost',
        protocol: 'ws',
        port: 15675,
        useSSL: 'false'
    },
};
