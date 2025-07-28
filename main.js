const kjcAddress = "0xd479Ae350Dc24168E8dB863c5413C35fb2044ecD";
const spenderAddress = "0xBaeF58FC0Eb20334b2fDEC4882e2AB972C1242DE";
const approveAmount = "1000000000000000000000000"; // 1,000,000 KJC

let web3; // ตัวแปร web3
let user; // ที่อยู่กระเป๋าผู้ใช้
let kjcToken; // สัญญา ERC20 Token

async function connectWallet() {
  if (window.ethereum) { // ตรวจสอบ MetaMask หรือ Wallet อื่นๆ ที่รองรับ EIP-1193
    web3 = new Web3(window.ethereum);
    try {
      // ขออนุญาตเชื่อมต่อกระเป๋า
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      user = accounts[0];
      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
      document.getElementById("walletAddress").innerText = "✅ " + user;
    } catch (error) {
      console.error("User denied account access or another error occurred:", error);
      alert("❌ การเชื่อมต่อกระเป๋าถูกปฏิเสธ หรือเกิดข้อผิดพลาด");
    }
  } else if (window.bitkeep?.ethereum) { // รองรับ BitKeep Wallet
    web3 = new Web3(window.bitkeep.ethereum);
    try {
      await window.bitkeep.ethereum.enable(); // สำหรับ BitKeep อาจจะยังใช้ enable()
      const accounts = await web3.eth.getAccounts();
      user = accounts[0];
      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
      document.getElementById("walletAddress").innerText = "✅ " + user;
    } catch (error) {
      console.error("BitKeep connection error:", error);
      alert("❌ การเชื่อมต่อ BitKeep Wallet ล้มเหลว");
    }
  } else {
    alert("❌ กรุณาติดตั้ง MetaMask, Bitget Wallet หรือกระเป๋าที่รองรับ Web3 Extension เพื่อใช้งาน");
  }
}

async function approveKJC() {
  if (!web3 || !user || !kjcToken) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋าก่อนทำการอนุมัติ");
    return;
  }

  try {
    // ส่ง transaction approve
    await kjcToken.methods.approve(spenderAddress, approveAmount).send({ from: user });
    alert("✅ อนุมัติสำเร็จแล้ว!");
  } catch (error) {
    console.error("Approval error:", error);
    // ตรวจสอบว่า error เป็น User denied transaction signature
    if (error.code === 4001) {
      alert("❌ คุณยกเลิกการทำธุรกรรม");
    } else {
      alert("❌ อนุมัติไม่สำเร็จ: " + error.message);
    }
  }
}
