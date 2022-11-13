const web3 = require("web3");
const fs = require('fs');
const BN = require('bn.js');

var randomnumber = (maximum, minimum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var randomBN = () => {
  const value = web3.utils.randomHex(30)
  const bn = web3.utils.toBN(value.toString('hex'), 16);
  return new BN(bn.toString().substring(0, randomnumber(30, 1))); // gera um número aleatório uniformemente distribuido em relacao ao numero de caracteres
}

const resp = [];
const x = [];
for(let i = 0;i<3000 ;i+=1){
  const a = randomBN();
  const b = randomBN();
  if(a.gt(b))resp.push({a:a.toString(),b:b.toString()});
  else resp.push({a:b.toString(),b:a.toString()});
}

fs.writeFile('test/GCD/GCD_data.json', JSON.stringify(resp, null, 4), err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
