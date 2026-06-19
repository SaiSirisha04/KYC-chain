// ✅ Check if Web3 is already defined (prevents redeclaration error)
if (typeof window.web3 === "undefined") {
    window.web3 = new Web3(window.ethereum || window.web3.currentProvider);
    if (window.ethereum) {
        window.ethereum.request({ method: "eth_requestAccounts" });
    }
}

// ✅ Ensure contract address is defined only once
if (typeof window.contractAddress === "undefined") {
    window.contractAddress = "0x67140E9a88ba73b4c9Db7ecE1d95978cc0FCC7FA"; // Your deployed contract address
}

// ✅ Ensure ABI is defined only once
if (typeof window.abi === "undefined") {
    window.abi = [ /* YOUR CONTRACT ABI HERE */ ];
}

const contractInstance = new web3.eth.Contract(window.abi, window.contractAddress);

// ✅ Signup Function
async function onSignUp() {
    const bank_name1 = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const reg = document.getElementById("reg_no").value;

    if (!bank_name1 || !pass || !reg) {
        alert("All fields are required!");
        return;
    }

    if (!confirm("I accept that the details provided are correct.")) {
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.addBank(bank_name1, pass, reg).send({
            from: accounts[0],
            gas: 4700000
        });

        alert(`${bank_name1} has been successfully added to the network!`);
        alert("Login from the 'Login' Tab on the top-right side of the webpage.");
    } catch (error) {
        console.error("Signup Error:", error);
        alert("Signup failed! Check console for details.");
    }
}

// ✅ Login Function
async function onLogin() {
    const bank_name_l = document.getElementById("username_l").value;
    const pass_l = document.getElementById("password_l").value;

    if (!bank_name_l || !pass_l) {
        alert("Enter valid login credentials!");
        return;
    }

    try {
        const bankExists = await contractInstance.methods.checkBank(bank_name_l, pass_l).call();
        if (!bankExists) {
            alert("Bank not in network. Sign up before proceeding.");
            return;
        }

        alert(`Welcome ${bank_name_l}!`);
        localStorage.setItem("bank_eth_account", pass_l);
        window.location.href = './resources/bankHomePage.html';
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed! Check console for details.");
    }
}

// ✅ Export functions for `index.html`
window.onSignUp = onSignUp;
window.onLogin = onLogin;
