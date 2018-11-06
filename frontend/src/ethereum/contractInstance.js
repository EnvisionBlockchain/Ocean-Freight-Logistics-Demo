import web3 from './web3';
//import Zatanna from './build/Zatanna.json';

var address = "0xdcca47d0396ccdd76fbfe9dc779f619184df9357";
var abi = [{"constant": false,"inputs": [{"name": "text","type": "string"}],"name": "postMsg","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getMsg","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}];

//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x26f05c41a24a4f393584fea897ace39deb2281c2");
const ContractInstance = new web3.eth.Contract(abi, address);
export default ContractInstance;
