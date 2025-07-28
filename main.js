const kjcAddress = "0xd479Ae350Dc24168E8dB863c5413C35fb2044ecD";
const spenderAddress = "0xBaeF58FC0Eb20334b2fDEC4882e2AB972C1242DE";
const approveAmount = "1000000000000000000000000"; // 1,000,000 KJC

let web3;
let user;
let kjcToken;

async function connectWallet() {
  if (window.bitkeep?.ethereum) {
    window.web3 = new Web3(window.bitkeep.ethereum);
    await window.bitkeep.ethereum.enable();
  } else if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    alert("❌ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  user = accounts[0];
  kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
  document.getElementById("walletAddress").innerText = "✅ " + user;
}

async function approveKJC() {
  if (!web3 || !user || !kjcToken) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋าก่อน");
    return;
  }

  try {
    await kjcToken.methods.approve(spenderAddress, approveAmount).send({ from: user });
    alert("✅ อนุมัติสำเร็จแล้ว!");
  } catch (error) {
    console.error(error);
    alert("❌ อนุมัติไม่สำเร็จ");
  }
}