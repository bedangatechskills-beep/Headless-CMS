import dns from "node:dns";

// Workaround: on some Windows setups Node can't auto-detect DNS servers
// and the SRV lookup behind mongodb+srv:// fails with ECONNREFUSED.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(","));
}

import mongoose from "mongoose";

export async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}