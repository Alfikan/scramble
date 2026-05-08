#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { db } from "./database.js";

const TABLES_IN_ORDER = [
  "session_breaks",
  "study_sessions",
  "quiz_attempts",
  "messages",
  "resources",
  "room_members",
  "rooms",
  "user_availability",
  "user_badges",
  "user_subjects",
  "study_preferences",
  "user_stats",
  "refresh_tokens",
  "oauth_accounts",
  "users",
];

async function confirmRollback() {
  console.log("\n⚠️  WARNING: This will delete ALL migrated data!");
  console.log("\nTables to be truncated:");
  for (const table of TABLES_IN_ORDER) {
    console.log(`  - ${table}`);
  }

  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\nType "ROLLBACK" to confirm: ', (answer) => {
      rl.close();
      resolve(answer === "ROLLBACK");
    });
  });
}

async function truncateTable(tableName) {
  try {
    await db.query(`TRUNCATE TABLE ${tableName} CASCADE`);
    console.log(`  ✓ Truncated ${tableName}`);
    return true;
  } catch (error) {
    console.log(`  ✗ Failed to truncate ${tableName}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("=".repeat(50));
  console.log("MIGRATION ROLLBACK");
  console.log("=".repeat(50));

  try {
    await db.connect();

    const confirmed = await confirmRollback();

    if (!confirmed) {
      console.log("\nRollback cancelled.");
      return;
    }

    console.log("\nStarting rollback...");

    let allSuccess = true;
    for (const table of TABLES_IN_ORDER) {
      const success = await truncateTable(table);
      if (!success) allSuccess = false;
    }

    console.log("\n" + "=".repeat(50));
    if (allSuccess) {
      console.log("ROLLBACK COMPLETE");
      console.log("=".repeat(50));
      console.log("\nAll tables have been truncated.");
      console.log("You can now re-run the migration with:");
      console.log("  npm run export-firestore && npm run import-postgres");
    } else {
      console.log("ROLLBACK PARTIAL");
      console.log("=".repeat(50));
      console.log("\nSome tables may not have been truncated.");
      console.log("Check the errors above and try again.");
    }
  } catch (error) {
    console.error("Rollback failed:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
