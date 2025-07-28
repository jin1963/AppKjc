const kjcAddress = "0xd479Ae350Dc24168E8dB863c5413C35fb2044ecD";
const spenderAddress = "0xBaeF58FC0Eb20334b2fDEC4882e2AB972C1242DE";
const approveAmount = "1000000000000000000000000"; // 1,000,000 KJC

let web3;
let user;
let kjcToken;

async function connectWallet() {
  if (!window.ethereum) {
    alert("❌ กรุณาติดตั้ง MetaMask ก่อนใช้งาน");
    return;
  }

  web3 = new Web3(window.ethereum);

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
    document.getElementById("walletAddress").innerText = "✅ " + user;

    const chainId = await web3.eth.getChainId();
    if (chainId !== 56) {
      alert("⚠️ กรุณาเปลี่ยนไปใช้ BNB Chain (Chain ID 56) ใน MetaMask");
    }

  } catch (error) {
    console.error("❌ Wallet connection error:", error);
    if (error.code === 4001) {
      alert("❌ คุณปฏิเสธการเชื่อมต่อกระเป๋า");
    } else {
      alert("❌ การเชื่อมต่อกระเป๋าถูกปฏิเสธ หรือเกิดข้อผิดพลาด");
    }
  }
}

async function approveKJC() {
  if (!web3 || !user || !kjcToken) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋าก่อนทำการอนุมัติ");
    return;
  }

  try {
    await kjcToken.methods.approve(spenderAddress, approveAmount).send({ from: user });
    alert("✅ อนุมัติสำเร็จแล้ว!");
  } catch (error) {
    console.error("❌ Approval error:", error);
    if (error.code === 4001) {
      alert("❌ คุณยกเลิกการทำธุรกรรม");
    } else {
      alert("❌ อนุมัติไม่สำเร็จ: " + error.message);
    }
  }
}
