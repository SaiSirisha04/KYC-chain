const Web3 = require('web3');

// Some versions of web3 may require you to pass a provider (even if null)
const web3 = new Web3(null);

// Print the checksummed address
console.log(web3.utils.toChecksumAddress("0x14e041521a40e32ed88b22c0f32469f5406d757a"));
