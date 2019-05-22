import web3 from './web3';
import SupplychainFactory from './build/contracts/SupplychainFactory.json';

//export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0x074042b598d52fe811c3228f791caed07eedbffc");
export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0xf764e10f60560374d35ed6b9c93458bc5d79fe0d");