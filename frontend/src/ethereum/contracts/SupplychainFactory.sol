pragma solidity ^0.4.24;

import "./SupplyChainTransportation.sol";

contract SupplychainFactory{
    address[] public deployedSupplychains;
    
    function createSupplyChain(string description, address freightCarrier, address originCustoms, address consignee) public returns (address newSupplychain){
        newSupplychain = new SupplyChainTransportation(msg.sender, description, freightCarrier, originCustoms, consignee);
        deployedSupplychains.push(newSupplychain);
    }
    
    function getDeployedSupplyChain() public view returns(address[]){
        return deployedSupplychains;
    }
}