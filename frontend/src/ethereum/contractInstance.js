import web3 from './web3';
import SupplyChainTransportation from './build/contracts/SupplyChainTransportation.json';

//var address = "0xdcca47d0396ccdd76fbfe9dc779f619184df9357";
//var abi = [{"constant": false,"inputs": [{"name": "text","type": "string"}],"name": "postMsg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getMsg","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}];
//const ContractInstance = new web3.eth.Contract(abi, address);

//export const SupplyChainInstance = new web3.eth.Contract(SupplyChainTransportation.abi, "0x5250b6be5568fd58b6244bb79c6a3a0ae9d9b87b"); // No Factory; state=0; Begin trade

export const SupplyChainInstance = (address) => {
	return new web3.eth.Contract(SupplyChainTransportation.abi, address);
}