const web3 = require("web3");
const fs = require('fs');

var randomnumber = (maximum, minimum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var randomBN = () => {
  const value = web3.utils.randomHex(randomnumber(10, 1))
  const bn = web3.utils.toBN(value.toString('hex'), 16);
  return bn;
}

const resp = [];
const x = [];
for(let i = 0;i<300 ;i+=1){
  const a = randomBN();
  const b = randomBN();
  if(a.gt(b))resp.push({a:a.toString(),b:b.toString()});
  else resp.push({a:b.toString(),b:a.toString()});
}

fs.writeFile('test/GCD_data.json', JSON.stringify(resp), err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
