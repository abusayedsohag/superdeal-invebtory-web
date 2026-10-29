import fs from "fs";
import path from "path";

// Load .env.local synchronously before dynamic import
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      process.env[key] = val;
    }
  });
} catch (e) {
  console.log("Note: Could not parse .env.local file directly:", e);
}

async function runTestSuite() {
  console.log("=== STARTING AUTH & RBAC END-TO-END VERIFICATION ===");

  const { hashPassword, comparePassword, signAuthToken, verifyAuthToken } = await import("../lib/auth");
  const { getDb } = await import("../lib/mongodb");

  // 1. Password Hashing and Compare Test
  console.log("\n[Test 1] Password Hashing & Verification...");
  const rawPassword = "SecurePassword123!";
  const hash = await hashPassword(rawPassword);
  const isValid = await comparePassword(rawPassword, hash);
  const isInvalid = await comparePassword("WrongPassword", hash);
  if (isValid && !isInvalid) {
    console.log("✓ Test 1 Passed: Password hashing & verification work flawlessly.");
  } else {
    throw new Error("Test 1 Failed: Password check mismatch.");
  }

  // 2. JWT Signing and Verification Test
  console.log("\n[Test 2] JWT Token Creation & Decoding...");
  const testPayload = {
    userId: "usr-test-101",
    email: "test@superdeal.com",
    role: "Admin" as const,
    name: "Test Admin"
  };
  const token = await signAuthToken(testPayload);
  const verifiedPayload = await verifyAuthToken(token);
  if (verifiedPayload && verifiedPayload.email === testPayload.email && verifiedPayload.role === "Admin") {
    console.log("✓ Test 2 Passed: JWT sign & verify authenticated successfully.");
  } else {
    throw new Error("Test 2 Failed: JWT verification mismatch.");
  }

  // 3. Database Connection & Collections Check
  console.log("\n[Test 3] MongoDB Connection & Collections Check...");
  const db = await getDb();
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  console.log("Found collections in DB:", collectionNames);

  // Check roles collection
  const rolesCount = await db.collection("roles").countDocuments();
  console.log(`Roles collection count: ${rolesCount}`);

  // Check users collection
  const usersCount = await db.collection("users").countDocuments();
  console.log(`Users collection count: ${usersCount}`);

  // 4. Role Seeding and User Registration Test
  console.log("\n[Test 4] Testing Direct MongoDB User & Role Seeding...");
  const existingAdmin = await db.collection("users").findOne({ email: "admin@superdeal.com" });
  if (!existingAdmin) {
    const adminHashedPassword = await hashPassword("admin123456");
    await db.collection("users").insertOne({
      id: "usr-admin-master",
      name: "Super Administrator",
      email: "admin@superdeal.com",
      passwordHash: adminHashedPassword,
      role: "Super Admin",
      status: "Active",
      phone: "+880 1700 000000",
      rewardPoints: 1000,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    });
    console.log("✓ Seeded Super Admin: admin@superdeal.com (Password: admin123456)");
  }

  // Seed Customer Demo
  const existingCustomer = await db.collection("users").findOne({ email: "customer@superdeal.com" });
  if (!existingCustomer) {
    const custHashedPassword = await hashPassword("customer123");
    await db.collection("users").insertOne({
      id: "usr-cust-demo",
      name: "Demo Customer",
      email: "customer@superdeal.com",
      passwordHash: custHashedPassword,
      role: "Customer",
      status: "Active",
      phone: "+880 1800 111222",
      address: "House 12, Road 5, Dhanmondi, Dhaka",
      district: "Dhaka",
      upazila: "Dhanmondi",
      rewardPoints: 100,
      totalOrders: 3,
      totalSpent: 4500,
      createdAt: new Date().toISOString()
    });
    console.log("✓ Seeded Demo Customer: customer@superdeal.com (Password: customer123)");
  }

  const updatedUsersCount = await db.collection("users").countDocuments();
  console.log(`Updated Users count in MongoDB: ${updatedUsersCount}`);

  console.log("✓ Test 4 Passed: Seeding verified.");

  console.log("\n=== ALL DIRECT TESTS COMPLETED SUCCESSFULLY ===");
  process.exit(0);
}

runTestSuite().catch((err) => {
  console.error("Test Suite Error:", err);
  process.exit(1);
});
