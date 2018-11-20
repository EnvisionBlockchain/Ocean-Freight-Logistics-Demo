import web3 from './web3';
import SupplychainFactory from './build/contracts/SupplychainFactory.json';

//export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0x8719f6d485bc53acae485ebbdd73e1f739e490d2");
export const FactoryInstance = new web3.eth.Contract(SupplychainFactory.abi, "0xf0a2631c8895947933424dbe605422c346023c4d");
