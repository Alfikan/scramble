#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { db } from "./database.js";
import { v4 as uuidv4 } from "uuid";

async function migrateOAuth() {
  console.log("\n--- OAuth Account Migration ---");
  console.log("This script helps migrate OAuth accounts from Firebase Auth.");
  console.log(
    "You will need to export Firebase Auth users with their provider data.\n",
  );

  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "Do you have Firebase Auth user export data? (yes/no): ",
      async (answer) => {
        rl.close();

        if (answer.toLowerCase() !== "yes") {
          console.log("\nTo migrate OAuth accounts:");
          console.log("1. Export Firebase Auth users from Firebase Console");
          console.log("2. Create a JSON file with provider data");
          console.log("3. Run this script again with the data");
          console.log("\nExpected format:");
          console.log(
            JSON.stringify(
              {
                firebaseUid: "user-uid",
                provider: "google",
                providerUid: "google-user-id",
                email: "user@example.com",
              },
              null,
              2,
            ),
          );
          resolve();
          return;
        }

        console.log("\nPaste your Firebase Auth export (JSON array):");

        const rl2 = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        let jsonInput = "";
        rl2.on("line", (line) => {
          jsonInput += line + "\n";
        });

        setTimeout(() => {
          rl2.close();
          processOAuthData(jsonInput);
          resolve();
        }, 5000);
      },
    );
  });
}

async function processOAuthData(jsonInput) {
  let oauthUsers;

  try {
    oauthUsers = JSON.parse(jsonInput);
    if (!Array.isArray(oauthUsers)) oauthUsers = [oauthUsers];
  } catch (error) {
    console.error("Invalid JSON:", error.message);
    return;
  }

  console.log(`\nFound ${oauthUsers.length} OAuth accounts to migrate...`);

  for (const oauth of oauthUsers) {
    try {
      const userResult = await db.query(
        "SELECT id FROM users WHERE firebase_uid = $1",
        [oauth.firebaseUid],
      );

      if (userResult.rows.length === 0) {
        console.log(
          `  Skipping ${oauth.email}: user not found in migrated data`,
        );
        continue;
      }

      const userId = userResult.rows[0].id;

      await db.query(
        `INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (provider, provider_user_id) DO NOTHING`,
        [uuidv4(), userId, oauth.provider, oauth.providerUid],
      );

      console.log(`  ✓ Migrated OAuth for ${oauth.email}`);
    } catch (error) {
      console.error(`  ✗ Error migrating ${oauth.email}:`, error.message);
    }
  }
}

async function main() {
  console.log("=".repeat(50));
  console.log("OAUTH MIGRATION");
  console.log("=".repeat(50));

  try {
    await db.connect();
    await migrateOAuth();
  } catch (error) {
    console.error("OAuth migration failed:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
