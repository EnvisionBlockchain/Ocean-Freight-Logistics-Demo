var PostBox = artifacts.require("./PostBox.sol");

module.exports = function(deployer) {
  deployer.deploy(PostBox);
};
