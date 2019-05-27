import web3 from './web3';
import SupplychainFactory from './build/contracts/SupplychainFactory.json';

//export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0xf764e10f60560374d35ed6b9c93458bc5d79fe0d");
export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0xf88cec914130d9be7ab5ac5408978349fe4e3c2b");
