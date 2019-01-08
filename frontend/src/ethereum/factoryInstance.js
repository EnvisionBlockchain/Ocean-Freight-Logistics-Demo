import web3 from './web3';
import SupplychainFactory from './build/contracts/SupplychainFactory.json';

//export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0xf0a2631c8895947933424dbe605422c346023c4d");
export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0x4c7298a59083f1d2ed3c93028b8e3e1dbda735ad");