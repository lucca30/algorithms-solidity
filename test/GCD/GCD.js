const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const GCD = artifacts.require("./GCD.sol");

// implementação original: https://gist.github.com/iamlockon/2b84cf7cbe01dc096df5efbd884409e7
function egcd(a, b) {
  if (a.lt(b)) [a, b] = [b, a];
  let s = web3.utils.toBN("0"), old_s = web3.utils.toBN("1");
  let t = web3.utils.toBN("1"), old_t = web3.utils.toBN("0");
  let r = web3.utils.toBN(b), old_r = web3.utils.toBN(a);
  while (r != 0) {
    let q = web3.utils.toBN(Math.floor(old_r / r));
    [r, old_r] = [old_r - q * r, r];
    [s, old_s] = [old_s - q * s, s];
    [t, old_t] = [old_t - q * t, t];
  }
  return { gcd: old_r, x: old_s, y: old_t };
}
let cenarios = [];

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('GCD', ([contractOwner, secondAddress, thirdAddress]) => {
  let gcd;
  return; // temporary skip this test

  // this would attach the deployed smart contract and its methods 
  // to the `gcd` variable before all other tests are run
  before(async () => {
    gcd = await GCD.deployed()
    let rawdata = fs.readFileSync('test/GCD/GCD_data.json');
    cenarios = JSON.parse(rawdata);
  })

  // check if deployment goes smooth
  describe('Teste GCD', () => {
    // check if the message is stored on deployment as expected
    it('GCD', async () => {
      // Calculate on chain
      for (let i = 0; i < cenarios.length; i += 1) {
        const message = await gcd.Soluciona.call(web3.utils.toBN(cenarios[i].a), web3.utils.toBN(cenarios[i].b));

        console.log(`Gás usado no algoritmo euclidiano para o cenário ${i}:\n Inicial: ${+message[2].toString()}\nExecução: ${+message[1].toString()}\nTotal:${+message[1].toString() + +message[2].toString()}`);
        cenarios[i].gasWhenCalculateOnChain = +message[1].toString() + +message[2].toString();
        cenarios[i].initialGasCalculate = +message[2].toString()
        cenarios[i].executionGasCalculate = +message[1].toString()
      }

      // Validate on chain
      for (let i = 0; i < cenarios.length; i += 1) {
        // console.log(`Cenário ${i}`);
        const a = web3.utils.toBN(cenarios[i].a);
        const b = web3.utils.toBN(cenarios[i].b);

        const localCall = a.egcd(b);
        // console.log(localCall);

        const maxInt = web3.utils.toBN("2").pow(web3.utils.toBN("255"));
        // console.log("Verificando se produto estoura o max number");
        // console.log(maxInt.lt(a.mul(localCall.a)));
        // console.log(maxInt.lt(b.mul(localCall.b)));

        // const gcdDividesBothValues = (a.mod(localCall.gcd)).eq(web3.utils.toBN("0")) && b.mod(localCall.gcd).eq(web3.utils.toBN("0"))
        // const theresTwoIntegersResultsGcdInBinomium = localCall.gcd.eq(a.mul(localCall.a) + b.mul(localCall.b))
        // console.log("Verificando offchain se o resultado ta correto: ", gcdDividesBothValues && theresTwoIntegersResultsGcdInBinomium);


        const message = await gcd.Verifica.call(a, b, localCall.gcd, localCall.a, localCall.b);
        console.log(`Gás usado na verificação para o cenário ${i}:\n Inicial: ${+message[2].toString()}\n Execução: ${+message[1].toString()}\n Total:${+message[1].toString() + +message[2].toString()}`);

        cenarios[i].gasWhenValidateOnChain = +message[1].toString() + +message[2].toString();
        cenarios[i].initialGasValidate = +message[2].toString()
        cenarios[i].executionGasValidate = +message[1].toString()

      }


      // Prepare results
      cenarios.forEach(x => { x.RatioCalculateVsValidate = x.gasWhenCalculateOnChain / x.gasWhenValidateOnChain });

      // Save results
      fs.writeFile('test/GCD/GCD_results.json', JSON.stringify(cenarios, null, 4), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    }).timeout(3000000)
  })

})