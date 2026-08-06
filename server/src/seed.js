import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDb } from "./db.js";
import User from "./models/user.js";
import SiteSettings from "./models/siteSettings.js";

// Run with: npm run seed
// Safe to run repeatedly — it only creates what's missing.
async function seed() {
  // Reuse db.js rather than calling mongoose.connect() directly, so the
  // DNS_SERVERS workaround (Plan 01, Task 5, Step 3) applies here too.
  await connectDb();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash });
    console.log(`Created admin user ${email}`);
  }

  const settings = await SiteSettings.findOne();
  if (!settings) {
    await SiteSettings.create({});   // schema defaults fill in the values
    console.log("Created default site settings");
  }

  await mongoose.disconnect();
}

seed();