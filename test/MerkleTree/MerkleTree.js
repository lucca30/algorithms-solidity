const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const MerkleTree = artifacts.require("./MerkleTree.sol");


let cenarios = [];

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('MerkleTree', ([contractOwner, secondAddress, thirdAddress]) => {
  let merkleTree;

  before(async () => {
    merkleTree = await MerkleTree.deployed()
  })

  
  describe('Teste MerkleTree', () => {
    it('MerkleTree', async () => {

    }).timeout(3000000)
  })

})