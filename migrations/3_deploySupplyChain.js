var SupplyChain = artifacts.require("./SupplyChainTransportation.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChain, 'Sample Descroption', '0x8B8ba03Ed61Ad1CB0E9bEFD0D02ECB444834887D', '0x8FB092b0C5D80D1f4A1A0FF17d5a638AFe24cFCe','0x44FF5b3a97b2DB908EEf2a289e49d08843D328E6');
};
