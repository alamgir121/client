import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.DB_NAME || "community_events");

function trustedOrigins() {
  return [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
  ].filter((u): u is string => Boolean(u)).map((u) => u.replace(/\/+$/, ""));
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
    },
  },
  
  plugins: [jwt()],
  trustedOrigins: trustedOrigins(),
});
