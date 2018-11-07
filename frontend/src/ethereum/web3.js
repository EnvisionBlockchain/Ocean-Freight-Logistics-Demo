import Web3 from 'web3';

let web3, defaultAcc;
function networkCheck(){
  web3.eth.net.getNetworkType((err, netId) => {
  switch (netId) {
    case "main":
    alert("This is Mainnet. Please switch to Azure PoA Network!");
    break
    case "ropsten":
    alert("This is Ropsten test network. Please switch to Azure PoA Network!");
    break
    case "rinkeby":
    alert("This is Rinkeby test network! Please switch to Azure PoA Network!");
    break
    case "kovan":
    alert("This is Kovan test network. Please switch to Azure PoA Network!");
    break
    default:
    //alert("Nice! It looks like you're connected to Azure PoA Network!");
  }
  })
}

async function get_account(){
  defaultAcc = await web3.eth.getAccounts();
  if (defaultAcc[0] == null){
    // User is not logged in
    alert("Please Login To MetaMask And Refresh Page");
  }
}

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.

  //const provider = new Web3.providers.HttpProvider("http://ethygqbek-dns-reg1.eastus.cloudapp.azure.com:8540");
  //web3 = new Web3(provider);
  web3 = new Web3(window.web3.currentProvider);
  get_account();
  
}else{
  // User is not running metamask

  alert("Please Install MetaMask from metamask.io");
  const provider = new Web3.providers.HttpProvider("http://ethygqbek-dns-reg1.eastus.cloudapp.azure.com:8540");
  web3 = new Web3(provider);
}

networkCheck();

export default web3;