const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc'); // Use installed solc version

const web3 = new Web3("http://localhost:8545");
const code = fs.readFileSync('kyc.sol', 'utf8');

// Use Solidity 0.4.26 compilation
const compiledContract = solc.compile(code);

console.log("Compiled contract output:", compiledContract); // Debug output

if (!compiledContract.contracts || Object.keys(compiledContract.contracts).length === 0) {
    console.error("Compilation failed:", compiledContract.errors);
    process.exit(1);
}

const contractName = Object.keys(compiledContract.contracts)[0];
const contractData = compiledContract.contracts[contractName];

function after2Delay() {
    contractInstance = kycContract.at(deployedContract.address);
    console.log("Contract deployed at address:", contractInstance.address);
}

function afterDelay() {
    console.log("Using contract:", contractName);
    
    const abiDefinition = JSON.parse(contractData.interface);
    const byteCode = contractData.bytecode;
    
    const kycContract = web3.eth.contract(abiDefinition);
    deployedContract = kycContract.new({ 
        data: byteCode, 
        from: web3.eth.accounts[0], 
        gas: 4700000 
    });

    setTimeout(after2Delay, 3000);
}

setTimeout(afterDelay, 8000);



