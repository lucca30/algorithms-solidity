const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const KSelect = artifacts.require("./KSelect.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

const values = [1,2,3,4,5,6,7,8];

contract('KSelect', ([contractOwner, secondAddress, thirdAddress]) => {
  let kSelect;

  before(async () => {
    kSelect = await KSelect.deployed()
  })

  describe('Teste KSelect', () => {
    it('KSelect', async () => {
      // Calculate on chain
      const message = await kSelect.Insere([1, 2, 3, 4, 5, 6, 7, 8]);
      // console.log(quickSelect(3));
      // const message2 = await kSelect.Consulta.call();
      const message3 = await kSelect.Soluciona.call(3);
      console.log(message3);

    }).timeout(3000000)
  })

})



function quickSelect(k) {
  let left = 0;
  let right = values.length - 1;
  let list = [];
  let pivotIndex;  
  for(let i = 0;i<values.length;i++){
    console.log(i);
    list[i] = values[i];
  }
  while(true){
      if (left == right){
        let response = [];
        for(let i = 0;i<left;i++){
          response[i] = list[i];
        }
        return response;
      }
      pivotIndex = Math.floor((left + right) / 2);     // Solidity has no random so we use the middle
      pivotIndex = partition(list, left, right, pivotIndex);
      if (k == pivotIndex)
      {
        let response = [];
        for(let i = 0;i<k;i++){
          response[i] = list[i];
        }
        return response;
      }
      if (k < pivotIndex){
        right = pivotIndex - 1;
      }
      else{
        left = pivotIndex + 1;
      }
  }
}

function partition(list, left, right, pivotIndex) {
  let pivotValue = list[pivotIndex];
  let temp = list[pivotIndex];
  console.log('pivotIndex: ', pivotIndex);
  list[pivotIndex] = list[right];
  console.log('pivotIndex: ', right);
  console.log(right);
  list[right] = temp;
  let storeIndex = left;
  for (let i = left;i <right;i++){
    if (list[i] < pivotValue){
      temp = list[storeIndex];
      console.log(storeIndex);
      list[storeIndex] = list[i];
      console.log(i);
      list[i] = temp;
      storeIndex++;
    }
  }
  temp = list[right];
  list[right] = list[storeIndex];
  list[storeIndex] = temp;
  return storeIndex;
}




/*
helpers to debug in truffle console

migrate --reset
instance = await KSelect.deployed()
instance.Insere([1, 2, 3, 4, 5, 6, 7, 8])
instance.Soluciona(3)

 


*/