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
      let cenarios = [];
      for(let i=0;i<=10;i++){
        console.log('Cenário ' + i);
        // InsereParaSoluciona
        let elements = [];
        let totalElements = Math.pow(2,i);
        for(let j=0;j<totalElements;j++){
          elements.push(web3.utils.randomHex(20));
        }
        let messageInsereParaSoluciona = await merkleTree.InsereParaSoluciona(elements);

        // InsereParaVerifica
        const tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true }); 
        let messageInsereParaVerifica = await merkleTree.InsereParaVerifica(tree.getHexRoot());
        
        for(let j=0;j<totalElements;j++){
          console.log(j);
          const leaf = keccak256(elements[j]);
          const proof = tree.getHexProof(leaf);
          let messageVerifica = await merkleTree.Verifica.call(elements[j], proof);
          let messageSoluciona = await merkleTree.Soluciona.call(elements[j]);
          cenarios.push(
            {
              N: totalElements,
              
              SolucionaGasInicial:+messageSoluciona[2].toString(),
              SolucionaGasExecucao:+messageSoluciona[1].toString(),
              SolucionaGasTotal:+messageSoluciona[1].toString() + +messageSoluciona[2].toString(),
              
              VerificaGasInicial:+messageVerifica[2].toString(),
              VerificaGasExecucao:+messageVerifica[1].toString(),
              VerificaGasTotal:+messageVerifica[1].toString() + +messageVerifica[2].toString(),

              RazaoSolucionaVerifica:(+messageSoluciona[1].toString() + +messageSoluciona[2].toString())/(+messageVerifica[1].toString() + +messageVerifica[2].toString())
            }
          );

        }
        fs.writeFile('test/MerkleTree/MerkleTree_results.json', JSON.stringify(cenarios, null, 4), err => {
          if (err) {
            console.error(err);
          }
          // file written successfully
        });

      }

    }).timeout(3000000);

    it('Insert Comparison', async () => {
      return;
      let cenarios = [];
      for(let i=0;i<=10;i++){
        console.log(i);
        // InsereParaSoluciona
        let elements = [];
        let totalElements = Math.pow(2,i);
        for(let j=0;j<totalElements;j++){
          elements.push(web3.utils.randomHex(20));
        }
        let messageInsereParaSoluciona = await merkleTree.InsereParaSoluciona.call(elements);

        // InsereParaVerifica
        const tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true }); 
        let messageInsereParaVerifica = await merkleTree.InsereParaVerifica.call(tree.getHexRoot());

        cenarios.push(
          {
            N: totalElements,
            
            InsereParaSolucionaGasInicial:+messageInsereParaSoluciona[1].toString(),
            InsereParaSolucionaGasExecucao:+messageInsereParaSoluciona[0].toString(),
            InsereParaSolucionaGasTotal:+messageInsereParaSoluciona[0].toString() + +messageInsereParaSoluciona[1].toString(),

            InsereParaVerificaGasInicial:+messageInsereParaVerifica[1].toString(),
            InsereParaVerificaGasExecucao:+messageInsereParaVerifica[0].toString(),
            InsereParaVerificaGasTotal:+messageInsereParaVerifica[0].toString() + +messageInsereParaVerifica[1].toString(),

            RazaoSolucionaVerifica:(+messageInsereParaSoluciona[0].toString() + +messageInsereParaSoluciona[1].toString())/(+messageInsereParaVerifica[0].toString() + +messageInsereParaVerifica[1].toString())
          }
        );
      }

      fs.writeFile('test/MerkleTree/MerkleTree_results_insere.json', JSON.stringify(cenarios, null, 4), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    }).timeout(3000000);
  })

})