var HDWalletProvider = require("truffle-hdwallet-provider");

var rpc_endpoint = "http://ethygqbek-dns-reg1.eastus.cloudapp.azure.com:8540";
var mnemonic = "candy clip enlist runway inquiry wood cable flush board matrix rain lawn";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    poa: {
      provider: new HDWalletProvider(mnemonic, rpc_endpoint),
      network_id: 3,
      gasPrice: 0
    }
  }
};