const { MerkleTree } = require('merkletreejs');
const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');
const keccak256 = require('keccak256');


const MerkleTreeContract = artifacts.require("./MerkleTree.sol");


let cenarios = [];

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('MerkleTree', ([contractOwner, secondAddress, thirdAddress]) => {
  let merkleTree;

  before(async () => {
    merkleTree = await MerkleTreeContract.deployed()
  })

  
  describe('Teste MerkleTree', () => {
    it('MerkleTree', async () => {
      
      // Creating Tree
      const values = [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
        "0x2222222222222222222222222222222222222223",
        "0x2222222222222222222222222222222222222224",
        "0x2222222222222222222222222222222222222225",
        "0x2222222222222222222222222222222222222226",
      ];
      const tree = new MerkleTree(values, keccak256, { hashLeaves: true, sortPairs: true }); 

      console.log('Merkle Root:', tree.getHexRoot()); // this is what we save on blockchain
      
      console.log('Define nova root start');
      console.log(await merkleTree.DefineNovaRoot(tree.getHexRoot()));
      console.log('Define nova root end');

      const leaf = keccak256(values[0]);

      const proof = tree.getHexProof(leaf);

      await merkleTree.Verifica(values[0], proof);
      

    }).timeout(3000000)
  })

})