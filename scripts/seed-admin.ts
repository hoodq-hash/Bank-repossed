/**
 * Creates the initial admin user in MongoDB.
 *
 * Usage (from project root):
 *   ADMIN_SEED_PASSWORD="your-secure-password" npx tsx scripts/seed-admin.ts
 *
 * Optional:
 *   ADMIN_SEED_USERNAME=admin   (default: admin)
 *
 * Uses MONGO or MONGODB_URI from .env / .env.local (same as src/lib/mongodb.ts).
 */
import path from "node:path";
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../src/models/AdminUser";

config({ path: path.join(process.cwd(), ".env.local") });
config({ path: path.join(process.cwd(), ".env") });

const MONGO_URI =
  process.env.MONGO || process.env.MONGODB_URI || "mongodb://localhost:27017/bank_repossessed_cars";

const username = (process.env.ADMIN_SEED_USERNAME || "admin").trim().toLowerCase();
const plainPassword = process.env.ADMIN_SEED_PASSWORD;

async function main() {
  if (!plainPassword || plainPassword.length < 8) {
    console.error(
      "Set ADMIN_SEED_PASSWORD in the environment (at least 8 characters).\n" +
        "Example: ADMIN_SEED_PASSWORD=\"YourLongPassword\" npx tsx scripts/seed-admin.ts"
    );
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await AdminUser.findOne({ username });
  if (existing) {
    console.log(`Admin user "${username}" already exists. Nothing to do.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(plainPassword, 12);
  await AdminUser.create({ username, passwordHash, role: "admin" });

  console.log(`Created admin user "${username}". You can sign in at /login.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
