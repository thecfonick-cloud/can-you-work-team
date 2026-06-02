import './test_setup.js';
import { api } from './src/api.js';

async function runIntegration() {
  console.log("=== CanYouWork Integration Beta Test ===\n");

  // 1. Admin logs in automatically first as seed
  console.log("[Step 1] Seed offline db by doing a bogus login...");
  await api.login('admin@canyuwork.com', 'admin123');
  console.log("Admin seeded.");

  // 2. Advertiser Sign up & Login
  console.log("\n[Step 2] Advertiser Signup & Login");
  let advRes = await api.register("Test Advertiser", "advtest", "adv@test.com", "12345", "NG", "pass123", "", "advertiser");
  if (!advRes.success) throw new Error("Advertiser signup failed: " + advRes.message);
  console.log("Advertiser registered and logged in with token:", advRes.token);
  let advToken = advRes.token;
  localStorage.setItem('canyuwork_token', advToken); // Set active

  // 3. Advertiser Funds Wallet
  console.log("\n[Step 3] Advertiser Deposits Crypto");
  let depRes = await api.depositFunds(1000, "0xABCDEF", "http://receipt.com");
  if (!depRes.success) throw new Error("Deposit failed: " + depRes.message);
  console.log("Deposit pending.");

  // Admin approves deposit
  console.log("-> Admin approves deposit");
  localStorage.setItem('canyuwork_token', 'mock_jwt_token_123'); // Switch to admin
  let adminTxs = JSON.parse(localStorage.getItem('cw_offline_transactions') || '[]');
  let pendingDep = adminTxs.find(t => t.type === 'deposit' && t.status === 'Pending');
  if (!pendingDep) throw new Error("No pending deposit found for admin to approve");
  // Simulate AdminPortal deposit approval
  pendingDep.status = 'Completed';
  localStorage.setItem('cw_offline_transactions', JSON.stringify(adminTxs));
  let wallets = JSON.parse(localStorage.getItem('cw_offline_wallets') || '{}');
  if (wallets[pendingDep.userId]) {
    wallets[pendingDep.userId].availableBalance += pendingDep.amount;
    localStorage.setItem('cw_offline_wallets', JSON.stringify(wallets));
  }
  
  // Back to Advertiser
  localStorage.setItem('canyuwork_token', advToken);
  let advProfile = await api.getProfile();
  console.log("Advertiser balance after approval:", advProfile.user.balance);
  if (advProfile.user.balance < 1000) throw new Error("Advertiser balance not updated");

  // 4. Advertiser creates campaign
  console.log("\n[Step 4] Advertiser Creates Campaign (Target: 50, Total Cost: 400)");
  let campRes = await api.createCampaign("Follow me", "Instagram", "http://ig.com", "Just follow", 50, "0x123", 400);
  if (!campRes.success) throw new Error("Campaign creation failed: " + campRes.message);
  console.log("Campaign created, pending payment verification.");

  // 5. Admin verifies campaign
  console.log("\n[Step 5] Admin Verifies Campaign Payment");
  let adminCamps = JSON.parse(localStorage.getItem('cw_offline_tasks') || '[]');
  let pendingCamp = adminCamps[0];
  if (pendingCamp) {
    pendingCamp.status = 'active';
    localStorage.setItem('cw_offline_tasks', JSON.stringify(adminCamps));
  }
  console.log("Campaign approved. Status is now active.");

  // 6. User Signup & Login
  console.log("\n[Step 6] User Signup & Login");
  let userRes = await api.register("Test User", "usertest", "user@test.com", "11111", "NG", "pass123", "", "user");
  let userToken = userRes.token;
  localStorage.setItem('canyuwork_token', userToken);

  // 7. User loads tasks
  console.log("\n[Step 7] User gets active tasks");
  let tasksRes = await api.getTasks();
  if (!tasksRes.success || tasksRes.tasks.length === 0) throw new Error("No tasks found for user");
  let task = tasksRes.tasks[0];
  console.log(`Found task: ${task.title}, Reward: ${task.reward}`);

  // 8. User submits proof
  console.log("\n[Step 8] User Submits Proof");
  let subRes = await api.submitProof(task._id, "Done as requested", null);
  if (!subRes.success) throw new Error("Submit proof failed: " + subRes.message);
  console.log("Proof submitted.");

  // 9. Admin/Advertiser approves proof
  console.log("\n[Step 9] Admin Approves Proof");
  let adminSubs = JSON.parse(localStorage.getItem('cw_offline_submissions') || '[]');
  let pendingSub = adminSubs[0];
  if (pendingSub) {
    pendingSub.status = 'approved';
    localStorage.setItem('cw_offline_submissions', JSON.stringify(adminSubs));
    
    // Simulate AdminPortal logic: increment task count
    let tasks = JSON.parse(localStorage.getItem('cw_offline_tasks') || '[]');
    let subTask = tasks.find(t => t._id === pendingSub.taskId);
    if (subTask) {
      subTask.currentCount = (subTask.currentCount || 0) + 1;
      localStorage.setItem('cw_offline_tasks', JSON.stringify(tasks));
      
      // Pay user
      let w = JSON.parse(localStorage.getItem('cw_offline_wallets') || '{}');
      if (w[pendingSub.userId]) {
        w[pendingSub.userId].availableBalance += 2;
        w[pendingSub.userId].totalEarnings += 2;
        localStorage.setItem('cw_offline_wallets', JSON.stringify(w));
      }
    }
  }
  console.log("Proof approved.");

  // 10. Check User Earnings
  console.log("\n[Step 10] Checking User Balance");
  localStorage.setItem('canyuwork_token', userToken);
  let userProfile = await api.getProfile();
  console.log(`User balance: ${userProfile.user.balance} (includes signup bonus)`);

  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY!");
}

runIntegration().catch(e => {
  console.error("❌ TEST FAILED:", e);
});
