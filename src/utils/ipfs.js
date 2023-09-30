const { create } = require('ipfs-http-client');

const ipfs = create({ host: 'infura.ipfs.io', port: 5001, protocol: 'https' });

export default ipfs;