export const environment = {
    production: false,
    hmr: true,
    baseUrl: 'http://localhost:8080',
    getNodeData: '/get-node-data',
    getEdgeData: '/get-edge-data',
    http: {
        apiUrl: 'amqp://guest:guest@localhost:15672/vhosts',
    },
    mqtt: {
        server: 'ws://localhost:15672',
        protocol: 'ws',
        port: 5672,
    },
};
