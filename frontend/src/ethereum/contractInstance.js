import web3 from './web3';
import PostBox from './build/contracts/PostBox.json';
import SupplyChainTransportation from './build/contracts/SupplyChainTransportation.json';

//var address = "0xdcca47d0396ccdd76fbfe9dc779f619184df9357";
//var abi = [{"constant": false,"inputs": [{"name": "text","type": "string"}],"name": "postMsg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getMsg","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}];
//const ContractInstance = new web3.eth.Contract(abi, address);

export const helloWorldInstance = new web3.eth.Contract(PostBox.abi, "0x7d0a7af75b095b3fb1d6dbda31577e77a59bd2f6");
export const SupplyChainInstance = new web3.eth.Contract(SupplyChainTransportation.abi, "0xbc99706eb7bcf79f2af24b784ce501ad4bd91399");
