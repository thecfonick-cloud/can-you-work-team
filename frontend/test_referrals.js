import './test_setup.js';
import { api } from './src/api.js';

async function testReferrals() {
  console.log("=== REFERRAL SYSTEM TEST ===\n");

  // Step 1: Register the REFERRER (User A)
  console.log("[Step 1] Register Referrer (User A)");
  let refRes = await api.register("Alice Referrer", "alice_ref", "alice@test.com", "11111", "NG", "pass123", "", "user");
  if (!refRes.success) throw new Error("Referrer signup failed: " + refRes.message);
  let aliceToken = refRes.token;
  console.log("  Alice registered. Token:", aliceToken);
  console.log("  Alice referral code:", refRes.user.referralCode);
  let aliceRefCode = refRes.user.referralCode;

  // Step 2: Check Alice's referral data (should be 0)
  localStorage.setItem('canyuwork_token', aliceToken);
  let aliceRefs = await api.getReferrals();
  console.log("\n[Step 2] Alice's initial referral data:");
  console.log("  Full response keys:", Object.keys(aliceRefs));
  console.log("  Stats:", JSON.stringify(aliceRefs.stats));
  console.log("  Total referrals:", aliceRefs.stats?.totalReferrals);
  console.log("  Active count:", aliceRefs.stats?.activeReferrals);
  console.log("  Total earnings:", aliceRefs.stats?.totalEarnings);

  // Step 3: Register User B WITH Alice's referral code
  console.log("\n[Step 3] Register User B with Alice's referral code:", aliceRefCode);
  let bobRes = await api.register("Bob Friend", "bob_friend", "bob@test.com", "22222", "NG", "pass123", aliceRefCode, "user");
  if (!bobRes.success) throw new Error("Bob signup failed: " + bobRes.message);
  let bobToken = bobRes.token;
  console.log("  Bob registered. Token:", bobToken);

  // Step 4: Check Alice's referral data AFTER Bob joined
  console.log("\n[Step 4] Alice's referral data after Bob joined:");
  localStorage.setItem('canyuwork_token', aliceToken);
  aliceRefs = await api.getReferrals();
  console.log("  Stats:", JSON.stringify(aliceRefs.stats));
  console.log("  Total referrals:", aliceRefs.stats?.totalReferrals);
  console.log("  Referral history:", JSON.stringify(aliceRefs.referralHistory, null, 2));

  if (aliceRefs.stats?.totalReferrals >= 1) {
    console.log("  ✅ PASS: Bob is tracked as Alice's referral!");
  } else {
    console.log("  ❌ FAIL: Bob was NOT tracked as Alice's referral!");
  }

  // Step 5: Check Alice got referral bonus
  console.log("\n[Step 5] Check Alice's wallet for referral bonus:");
  let aliceProfile = await api.getProfile();
  console.log("  Alice balance:", aliceProfile.user?.balance);
  if (aliceProfile.user?.balance > 200) {
    console.log("  ✅ PASS: Alice received referral bonus! Balance:", aliceProfile.user.balance);
  } else {
    console.log("  ❌ FAIL: Alice did not receive referral bonus");
  }

  // Step 6: Register User C also with Alice's referral code
  console.log("\n[Step 6] Register User C with Alice's referral code");
  let charlieRes = await api.register("Charlie Pal", "charlie_pal", "charlie@test.com", "33333", "NG", "pass123", aliceRefCode, "user");
  if (!charlieRes.success) throw new Error("Charlie signup failed: " + charlieRes.message);

  // Step 7: Final referral count check
  console.log("\n[Step 7] Alice's referral data after 2 friends joined:");
  localStorage.setItem('canyuwork_token', aliceToken);
  aliceRefs = await api.getReferrals();
  console.log("  Stats:", JSON.stringify(aliceRefs.stats));
  console.log("  Referral history:", JSON.stringify(aliceRefs.referralHistory, null, 2));

  if (aliceRefs.stats?.totalReferrals >= 2) {
    console.log("\n  ✅ PASS: Both referrals tracked!");
  } else {
    console.log("\n  ❌ FAIL: Expected 2 referrals, got", aliceRefs.stats?.totalReferrals);
  }

  // Step 8: Final wallet check
  localStorage.setItem('canyuwork_token', aliceToken);
  aliceProfile = await api.getProfile();
  console.log("\n[Step 8] Alice's final balance (signup ₦200 + 2x referral ₦200):");
  console.log("  Balance:", aliceProfile.user?.balance, "(expected ₦600)");
  if (aliceProfile.user?.balance >= 600) {
    console.log("  ✅ PASS: Referral earnings correct!");
  } else {
    console.log("  ❌ FAIL: Expected ₦600, got", aliceProfile.user?.balance);
  }

  console.log("\n=== REFERRAL TEST COMPLETE ===");
}

testReferrals().catch(e => {
  console.error("❌ TEST FAILED:", e);
});
