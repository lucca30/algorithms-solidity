const { assert } = require("chai")
const web3 = require("web3");

const GCD = artifacts.require("./GCD.sol");

// implementação original: https://gist.github.com/iamlockon/2b84cf7cbe01dc096df5efbd884409e7
function egcd(a,b) {
  if (a.lt(b)) [a,b] = [b, a];
  let s = web3.utils.toBN("0"), old_s = web3.utils.toBN("1");
  let t = web3.utils.toBN("1"), old_t = web3.utils.toBN("0");
  let r = web3.utils.toBN(b), old_r = web3.utils.toBN(a);
  while (r != 0) {
      let q =  web3.utils.toBN(Math.floor(old_r/r));
      [r, old_r] = [old_r - q*r, r];
      [s, old_s] = [old_s - q*s, s];
      [t, old_t] = [old_t - q*t, t];
  }
  return {gcd:old_r, x: old_s, y: old_t};
}
const cenarios = [
  { a: "35", b: "15" },
  { a: "19263068", b: "263068" },

  // worst scenarios (consecutive fibonacci numbers)
  { a: "354224848179261915075", b: "218922995834555169026" },
  { a: "280571172992510140037611932413038677189525", b: "173402521172797813159685037284371942044301" },
  { a: "7896325826131730509282738943634332893686268675876375", b: "4880197746793002076754294951020699004973287771475874" },
];

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('GCD', ([contractOwner, secondAddress, thirdAddress]) => {
  let gcd

  // this would attach the deployed smart contract and its methods 
  // to the `gcd` variable before all other tests are run
  before(async () => {
    gcd = await GCD.deployed()

  })

  // check if deployment goes smooth
  describe('validate', () => {
    // check if the message is stored on deployment as expected
    it('Euclidian Algorithm', async () => {
      for (let i = 0; i < cenarios.length; i += 1) {
        const message = await gcd.euclidianAlgorithm(web3.utils.toBN(cenarios[i].a), web3.utils.toBN(cenarios[i].b));
        console.log(`Gás usado no algoritmo euclidiano para o cenário ${i}`, message.receipt.gasUsed);

      }
    })
    it('Validate Extended Euclidian Algorithm', async () => {
      for (let i = 0; i < cenarios.length; i += 1) {
        console.log(`Cenário ${i}`);
        const localCall = egcd(web3.utils.toBN(cenarios[i].a), web3.utils.toBN(cenarios[i].b));
        console.log(localCall);
        
        const maxInt = web3.utils.toBN("2").pow(web3.utils.toBN("255"));
        console.log(maxInt.lt(web3.utils.toBN(cenarios[i].a)*web3.utils.toBN(localCall.x)));
        console.log(maxInt.lt(web3.utils.toBN(cenarios[i].b)*web3.utils.toBN(localCall.y)));
        
        const message = await gcd.verifyGcd(web3.utils.toBN(cenarios[i].a), web3.utils.toBN(cenarios[i].b), web3.utils.toBN(localCall.gcd), web3.utils.toBN(localCall.x), web3.utils.toBN(localCall.y));
        console.log(`Gás usado no algoritmo euclidiano para o cenário ${i}`, message.receipt.gasUsed);

      }
    })


  })

})