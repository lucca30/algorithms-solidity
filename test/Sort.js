const { assert } = require("chai")

const Sort = artifacts.require("./Sort.sol")

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract('Sort', ([contractOwner, secondAddress, thirdAddress]) => {
  let sort

  // this would attach the deployed smart contract and its methods 
  // to the `sort` variable before all other tests are run
  before(async () => {
    sort = await Sort.deployed()
  })

  // check if deployment goes smooth
  describe('deployment', () => {
    // check if the smart contract is deployed 
    // by checking the address of the smart contract
    it('deploys successfully', async () => {
      const address = await sort.address

      assert.notEqual(address, '')
      assert.notEqual(address, undefined)
      assert.notEqual(address, null)
      assert.notEqual(address, 0x0)
    })

    // check if the message is stored on deployment as expected
    it('has a message', async () => {
      const message = await sort.message()
      assert.equal(message, 'Hello World!')
    })
  })

  describe('message', () => {
    // check if owner can set new message, check if setMessage works
    it('contract owner sets a message', async () => {
      // set new message
      const x = await sort.setMessage('Hi there!', { from: contractOwner }) ;
      // console.log(x.receipt.gasUsed);
      // `from` helps us identify by any address in the test

      // check new message
      const message = await sort.message()
      assert.equal(message, 'Hi there!')
    })

    // make sure only owner can setMessage and no one else
    it('address that is not the owner fails to set a message', async () => {
      await sort.setMessage('Hi there!', { from: secondAddress })
        .should.be.rejected
      // this tells Chai that the test should pass if the setMessage function fails.

      await sort.setMessage('Hi there!', { from: thirdAddress })
        .should.be.rejected
    })
  })
})