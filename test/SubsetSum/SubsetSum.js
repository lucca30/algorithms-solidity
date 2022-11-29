const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const SubsetSum = artifacts.require("./SubsetSum.sol");

function isSubsetSumRecursive(set, n, sum) {
  if (sum == 0)
    return true;
  if (n == 0)
    return false;
  //Se ultrapassar a soma, ignora
  if (set[n - 1] > sum)
    return isSubsetSumRecursive(set, n - 1, sum);

  // Recursão utilizando ou não o item
  return isSubsetSumRecursive(set, n - 1, sum)
    || isSubsetSumRecursive(set, n - 1, sum - set[n - 1]);
}

function isSubsetSumDP(set, n, sum) {
  let subset = new Array(sum + 1);

  for (let i = 0; i < sum + 1; i++) {
    subset[i] = new Array(n + 1);
    for (let j = 0; j < n + 1; j++) {
      subset[i][j] = false;
    }
  }

  for (let i = 0; i <= n; i++)
    subset[0][i] = true;

  for (let i = 1; i <= sum; i++)
    subset[i][0] = false;

  for (let i = 1; i <= sum; i++) {
    for (let j = 1; j <= n; j++) {
      subset[i][j] = subset[i][j - 1];
      if (i >= set[j - 1])
        subset[i][j] = subset[i][j]
          || subset[i - set[j - 1]][j - 1];
    }
  }

  return subset[sum][n];
}

function isSubsetSumMemoization(set, n, sum, isFirstCall = true, tab = []) {
  if(isFirstCall)
    tab = Array(n+1).fill().map(() => Array(sum+1).fill(-1));

  if (sum == 0)
      return 1;

  if (n <= 0)
      return 0;

  if (tab[n - 1][sum] != -1)
      return tab[n - 1][sum];

  if (set[n - 1] > sum)
      return tab[n - 1][sum] = isSubsetSumMemoization(set, n - 1, sum, false, tab);
  else {
      return tab[n - 1][sum] = isSubsetSumMemoization(set, n - 1, sum, false, tab) ||
          isSubsetSumMemoization(set, n - 1, sum - set[n - 1], false, tab);
  }
}

function subsetSumDP(set, n, sum) {
  let subset = new Array(sum + 1);

  for (let i = 0; i < sum + 1; i++) {
    subset[i] = new Array(n + 1);
    for (let j = 0; j < n + 1; j++) {
      subset[i][j] = [false, [0,0]];
    }
  }

  for (let i = 0; i <= n; i++)
    subset[0][i] = [true, [0,0]];

  for (let i = 1; i <= sum; i++)
    subset[i][0] = [false, [0,0]];

  for (let i = 1; i <= sum; i++) {
    for (let j = 1; j <= n; j++) {
      subset[i][j] = [subset[i][j - 1][0],[i,j-1]];
      if (i >= set[j - 1]){
        if(subset[i - set[j - 1]][j - 1][0])
          subset[i][j] = [subset[i - set[j - 1]][j - 1][0], [i - set[j - 1], j-1]]  
      }

    }
  }

  let response = [];
  if(subset[sum][n][0]){
    let tempSum = sum;
    let tempN = n;
    while(tempSum != 0 & n != 0){
      if(tempSum != subset[tempSum][tempN][1][0])
        response.push(set[subset[tempSum][tempN][1][1]]);
      
        tempSum = subset[tempSum][tempN][1][0];
        tempN = subset[tempSum][tempN][1][1]
    }
  }

  return response.reverse();
}

require("chai")
  .use(require("chai-as-promised"))
  .should()

let cenarios = [];

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateCenarios(){
  for(let n=1;n<=10;n++){
    for(let i=0;i<20;i++){
      let set = new Array(n).map((x) => randomIntFromInterval(1, 10));
      while(true){
        let sum = randomIntFromInterval(1, 20);
        if(isSubsetSumDP(set, n, sum)){
          let certificado = subsetSumDP(set, n, sum);


        }
      }

    }
  }
}


contract('SubsetSum', ([contractOwner, secondAddress, thirdAddress]) => {
  let subsetSum;

  // this would attach the deployed smart contract and its methods 
  // to the `subsetSum` variable before all other tests are run
  before(async () => {
    subsetSum = await SubsetSum.deployed()
  })

  // check if deployment goes smooth
  describe('Teste SubsetSum', () => {
    // check if the message is stored on deployment as expected
    it('SubsetSum', async () => {
      // Calculate on chain
      let set = [3, 34, 4, 12, 5, 2];
      let sum = 9;
      let n = set.length;

      console.log(isSubsetSumRecursive(set, n, sum));
      console.log(isSubsetSumDP(set, n, sum));
      console.log(isSubsetSumMemoization(set, n, sum));
      let certificado = subsetSumDP(set, n, sum);
      certificado = [4,5];

      let message1 = await subsetSum.SolucionaRecursivo.call(set, sum);
      console.log(message1[0]);

      let message2 = await subsetSum.SolucionaDP.call(set, sum);
      console.log(message2[0]);

      let message3 = await subsetSum.SolucionaMemoizacao.call(set, sum);
      console.log(message3[0]);

      let message4 = await subsetSum.Verifica.call(set, sum, certificado);
      console.log(message4[0]);

      // Save results
      fs.writeFile('test/SubsetSum/SubsetSum_results.json', JSON.stringify(cenarios, null, 4), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    }).timeout(3000000)
  })

})