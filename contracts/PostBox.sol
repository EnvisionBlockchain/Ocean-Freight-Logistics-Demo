pragma solidity ^0.4.11;

contract PostBox {
    string message;
    
    function postMsg(string text) external {
        message = text;
    }

    function getMsg() public view returns (string) {
        return message;
    }
}