const { assert } = require("chai")
const web3 = require("web3");
const fs = require('fs');

const KSelect = artifacts.require("./KSelect.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('KSelect', ([contractOwner, secondAddress, thirdAddress]) => {
  let kSelect;

  before(async () => {
    kSelect = await KSelect.deployed()
  })

  describe('Teste KSelect', () => {
    it('KSelect', async () => {
      // Calculate on chain
      const message = await kSelect.Insere([1, 2, 3, 4, 5, 6, 7, 8]);

      // const message2 = await kSelect.Consulta.call();
      const message3 = await kSelect.Soluciona.call(3);
      console.log(message3);

    }).timeout(3000000)
  })

})