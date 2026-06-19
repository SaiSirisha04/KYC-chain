// Ensure Web3 is properly initialized
let web3;

function toSafeBN(value) {
    if (!value || value === "null" || value === "") {
        return new web3.utils.BN(0);
    }
    if (!web3.utils.isHexStrict(value)) {
        value = web3.utils.toHex(value);
    }
    return new web3.utils.BN(value);
}

let contractInstance = null; // Ensure globally defined

// Ensure Web3 is properly initialized without MetaMask
async function initWeb3() {
    console.log("⏳ Initializing Web3...");

    // 🔹 Force Web3 to use Ganache, ignoring MetaMask
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    console.log("✅ Connected to Ganache at http://127.0.0.1:8545");

    await loadContract();
}

async function loadContract() {
    try {
        console.log("⏳ Fetching contract details...");

        // Fetch Contract Address
        const response = await fetch("build/contractAddress.json");
        if (!response.ok) throw new Error("❌ Failed to fetch contract address.");
        const data = await response.json();
        const contractAddress = data.address?.trim();

        console.log("✅ Contract Address:", contractAddress);

        if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("❌ Contract address is missing or invalid. Redeploy the contract.");
        }

        // Fetch Contract ABI
        const abiResponse = await fetch("build/kyc.abi");
        if (!abiResponse.ok) throw new Error("❌ Failed to fetch contract ABI.");
        const contractABI = await abiResponse.json();

        console.log("✅ Contract ABI fetched successfully:", contractABI);

        // 🚀 Debug Web3 Before Initializing the Contract
        console.log("🔍 Web3 Object:", web3);
        console.log("🔍 Web3.eth:", web3.eth);
        console.log("🔍 Web3.eth.Contract:", web3.eth.Contract);

        if (!web3.eth.Contract) {
            throw new Error("❌ web3.eth.Contract is undefined! Possible Web3 issue.");
        }

        // ✅ Correct Way to Initialize Contract
        contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        console.log("✅ Contract instance initialized:", contractInstance);
    } catch (error) {
        console.error("❌ Error loading contract:", error);
    }
}


// Run Web3 Initialization when page loads
document.addEventListener("DOMContentLoaded", initWeb3);

// Check if web storage is supported
if (typeof(Storage) === "undefined") {
    alert("Sorry, your browser does not support web storage. Upgrade to IE9 or contemporary platforms. Thank You for showing interest in us!");
}

// Sign up function
async function onSignUp() {
    if (!contractInstance) {
        alert("⚠️ Contract not loaded yet. Please try again.");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];  // ✅ Correct way to get the first account

    const bank_name1 = document.getElementById("username").value;
    if (!bank_name1) {
        alert("⚠️ Enter a valid username!");
        return;
    }

    const pass = document.getElementById("password").value;
    if (!pass) {
        alert("⚠️ Enter a valid password!");
        return;
    }

    const reg = document.getElementById("reg_no").value;
    if (!reg) {
        alert("⚠️ Enter a valid registration number!");
        return;
    }

    if (!confirm("I accept that the details provided are correct.")) {
        window.location = './index.html';
        return;
    }

    try {
        console.log(`⏳ Registering bank: ${bank_name1}`);
        await contractInstance.methods.addBank(bank_name1, senderAddress, reg).send({
            from: senderAddress,
            gas: 4700000
        });

        alert(`✅ ${bank_name1} successfully added to the network!`);
        alert("Login from the \"Login\" Tab on the top-right side of the webpage. \n Thank you for choosing KYC chain!");
    } catch (error) {
        console.error("❌ Error during signup:", error);
        alert("Signup failed. Try again.");
    }
}


// Login function
async function onLogin() {
    if (!contractInstance) {
        alert("⚠️ Contract not loaded yet. Please try again.");
        return;
    }

    const bank_name_l = document.getElementById("username_l").value;
    const pass_l = document.getElementById("password_l").value;

    if (!bank_name_l) {
        alert("⚠️ Enter a valid bank name!");
        return;
    }

    if (!pass_l) {
        alert("⚠️ Enter a valid password!");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];
        
        console.log("Calling checkBank with:", bank_name_l, pass_l);
        const bankExists = await contractInstance.methods.checkBank(bank_name_l, pass_l).call();
        console.log("checkBank returned:", bankExists);
        
        if (bankExists === "null") {
            alert("❌ Bank not found. Please sign up first.");
            return;
        }

        alert(`✅ Welcome ${bank_name_l}!`);
        localStorage.setItem("bank_eth_account", senderAddress);
        window.location = './resources/bankHomePage.html';
    } catch (error) {
        console.error("❌ Error during login:", error);
        alert("Login failed. Try again.");
    }
}

document.addEventListener("DOMContentLoaded", initWeb3);















