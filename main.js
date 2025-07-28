const kjcAddress = "0xd479Ae350Dc24168E8dB863c5413C35fb2044ecD";
const spenderAddress = "0xBaeF58FC0Eb20334b2fDEC4882e2AB972C1242DE";
const approveAmount = "1000000000000000000000000";

let web3;
let userAccount;
let kjcToken;

async function connectWallet() {
  try {
    console.log("📡 เริ่มเชื่อมต่อ wallet...");

    if (window.bitkeep?.ethereum && window.bitkeep.ethereum.isBitKeep) {
      console.log("🟡 ตรวจพบ Bitget");
      web3 = new Web3(window.bitkeep.ethereum);
      await window.bitkeep.ethereum.enable();
    } else if (window.ethereum) {
      console.log("🟢 ตรวจพบ MetaMask");
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      alert("⚠️ ไม่พบ Wallet เช่น MetaMask หรือ Bitget");
      return;
    }

    const accounts = await web3.eth.getAccounts();
    console.log("👤 accounts:", accounts);
    userAccount = accounts[0];

    if (!userAccount) {
      throw new Error("⚠️ ไม่พบบัญชีผู้ใช้ (accounts ว่างเปล่า)");
    }

    kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);
    document.getElementById("walletAddress").innerText = "✅ " + userAccount;

    const chainId = await web3.eth.getChainId();
    if (chainId !== 56) {
      alert("⚠️ กรุณาเชื่อมต่อ BNB Chain (ChainId 56)");
    }

  } catch (e) {
    console.error("❌ เกิดข้อผิดพลาด:", e);
    if (e.code === 4001) {
      alert("❌ คุณปฏิเสธการเชื่อมต่อ");
    } else {
      alert("❌ เชื่อมต่อล้มเหลว: " + (e.message || "ไม่ทราบสาเหตุ"));
    }
    document.getElementById("walletAddress").innerText = "❌ เชื่อมต่อล้มเหลว";
  }
}

async function approveKJC() {
  if (!web3 || !userAccount || !kjcToken) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋าก่อน");
    return;
  }

  try {
    await kjcToken.methods.approve(spenderAddress, approveAmount).send({ from: userAccount });
    alert("✅ อนุมัติ KJC สำเร็จแล้ว!");
  } catch (e) {
    console.error("❌ Approval error:", e);
    if (e.code === 4001) {
      alert("❌ คุณยกเลิกการอนุมัติ");
    } else {
      alert("❌ อนุมัติไม่สำเร็จ: " + e.message);
    }
  }
}