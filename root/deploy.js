const fs = require("fs");
const Web3 = require("web3").Web3;

const web3 = new Web3("http://127.0.0.1:8545");

const bytecode = fs.readFileSync("./build/kyc.bin", "utf8");
const abi = JSON.parse(fs.readFileSync("./build/kyc.abi", "utf8"));

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Deploying from account:", accounts[0]);

        const gasPrice = await web3.eth.getGasPrice();
        const contract = new web3.eth.Contract(abi);

        const deployedContract = await contract.deploy({ data: "0x" + bytecode })
            .send({ from: accounts[0], gas: 5000000, gasPrice });

        const contractAddress = deployedContract.options.address;
        console.log("✅ Contract deployed at:", contractAddress);

        if (!contractAddress) {
            throw new Error("❌ Deployment failed. Contract address is undefined.");
        }

        // Ensure the address is written properly
        const addressPath = './build/contractAddress.json';
        fs.writeFileSync(addressPath, JSON.stringify({ address: contractAddress }, null, 2));
        console.log("✅ Contract address saved to:", addressPath);

    } catch (error) {
        console.error("❌ Deployment failed:", error);
    }
};

deploy();





