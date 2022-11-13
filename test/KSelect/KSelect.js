const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');
const BN = require('bn.js');

const KSelect = artifacts.require("./KSelect.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

const localValues = [];

contract('KSelect', ([contractOwner, secondAddress, thirdAddress]) => {
  let kSelect;

  before(async () => {
    kSelect = await KSelect.deployed()
  })

  describe('Teste KSelect', () => {
    it('KSelect', async () => {
      // Calculate on chain
      let totalItens = 0;
      for (let i = 1; i < 8; i++) {
        let newPow = Math.pow(2,i);
        let elementsToInsert = newPow - totalItens;
        let arrayToInsert = [];
        for (let j = 0; j < elementsToInsert; j++) {
          const newValue = randomBN();
          arrayToInsert.push(newValue);
          localValues.push(+newValue.toString());
        }
        while (arrayToInsert.length) {
          let splitOfArrayToInsert = arrayToInsert.splice(0, 256); // enviando de 256 em 256
          await kSelect.Insere(splitOfArrayToInsert);
        }
        totalItens = newPow;
        const message = await kSelect.Consulta.call();
        const valuesOnBlockchain = message.map(x => +x.toString());

        for (j = 0; j < i; j++) {
          const k = Math.pow(2,j);
          console.log(`Cenário:\n N=${totalItens}\n K=${k}`);
          const messageSoluciona = await kSelect.Soluciona.call(k);
          const responseSoluciona = messageSoluciona[0].map(x => +x.toString());
          
          const responseCertificador = quickSelect(k);
          // console.log(valuesOnBlockchain);
          // console.log(responseCertificador.sort((a, b) => a-b));
          
          const messageVerifica = await kSelect.Verifica.call(k, responseCertificador.sort((a, b) => a-b));
          const responseVerifica = messageVerifica[0].map(x => +x.toString());

          console.log(
            responseSoluciona.sort((a, b) => a-b).join() ===  responseCertificador.sort((a, b) => a-b).join()
            &&
            responseSoluciona.sort((a, b) => a-b).join() === responseVerifica.sort((a, b) => a-b).join()
            &&
            responseSoluciona.sort((a, b) => a-b).join() === [...valuesOnBlockchain].sort((a, b) => a-b).slice(0, k).join()
            );

        }
      }

    }).timeout(300000000)
  })

})



function quickSelect(k) {
  let left = 0;
  let right = localValues.length - 1;
  let list = [];
  let pivotIndex;
  for (let i = 0; i < localValues.length; i++) {
    list[i] = localValues[i];
  }
  while (true) {
    if (left == right) {
      let response = [];
      for (let i = 0; i < left; i++) {
        response[i] = list[i];
      }
      return response;
    }
    pivotIndex = Math.floor((left + right) / 2);     // Solidity has no random so we use the middle
    pivotIndex = partition(list, left, right, pivotIndex);
    if (k == pivotIndex) {
      let response = [];
      for (let i = 0; i < k; i++) {
        response[i] = list[i];
      }
      return response;
    }
    if (k < pivotIndex) {
      right = pivotIndex - 1;
    }
    else {
      left = pivotIndex + 1;
    }
  }
}

function partition(list, left, right, pivotIndex) {
  let pivotValue = list[pivotIndex];
  let temp = list[pivotIndex];
  list[pivotIndex] = list[right];
  list[right] = temp;
  let storeIndex = left;
  for (let i = left; i < right; i++) {
    if (list[i] < pivotValue) {
      temp = list[storeIndex];
      list[storeIndex] = list[i];
      list[i] = temp;
      storeIndex++;
    }
  }
  temp = list[right];
  list[right] = list[storeIndex];
  list[storeIndex] = temp;
  return storeIndex;
}

var randomnumber = (maximum, minimum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var randomBN = () => {
  const value = web3.utils.randomHex(30)
  const bn = web3.utils.toBN(value.toString('hex'), 16);
  return new BN(bn.toString().slice(-randomnumber(4, 2))); // gera um número aleatório uniformemente distribuido em relacao ao numero de caracteres
}


/*
helpers to debug in truffle console

migrate --reset
instance = await KSelect.deployed()
instance.Insere([1, 2, 3, 4, 5, 6, 7, 8])
instance.Soluciona(3)

account = (await web3.eth.getAccounts())[0]
web3.eth.defaultAccount = account
await web3.eth.sendTransaction(instance.Verifica.request(4, [ 23, 41, 56, 62 ]))
 


*/