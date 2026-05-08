#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { db } from "./database.js";

async function verifyCounts() {
  console.log("\n--- Record Counts ---");

  const tables = [
    "users",
    "user_stats",
    "study_preferences",
    "user_subjects",
    "user_badges",
    "user_availability",
    "oauth_accounts",
    "rooms",
    "room_members",
    "messages",
    "resources",
    "study_sessions",
    "session_breaks",
    "quiz_attempts",
  ];

  const counts = {};

  for (const table of tables) {
    try {
      const result = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count);
      console.log(`  ${table}: ${counts[table]}`);
    } catch (error) {
      counts[table] = `ERROR: ${error.message}`;
      console.log(`  ${table}: ERROR`);
    }
  }

  return counts;
}

async function verifyRelationships() {
  console.log("\n--- Relationship Integrity ---");

  const checks = [
    {
      name: "Users without stats",
      query: `SELECT COUNT(*) as count FROM users u LEFT JOIN user_stats us ON u.id = us.user_id WHERE us.user_id IS NULL`,
    },
    {
      name: "Users without preferences",
      query: `SELECT COUNT(*) as count FROM users u LEFT JOIN study_preferences sp ON u.id = sp.user_id WHERE sp.user_id IS NULL`,
    },
    {
      name: "Rooms without members",
      query: `SELECT COUNT(*) as count FROM rooms r LEFT JOIN room_members rm ON r.id = rm.room_id WHERE rm.room_id IS NULL`,
    },
    {
      name: "Messages with missing users",
      query: `SELECT COUNT(*) as count FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE u.id IS NULL`,
    },
    {
      name: "Messages with missing rooms",
      query: `SELECT COUNT(*) as count FROM messages m LEFT JOIN rooms r ON m.room_id = r.id WHERE r.id IS NULL`,
    },
    {
      name: "Study sessions with missing users",
      query: `SELECT COUNT(*) as count FROM study_sessions ss LEFT JOIN users u ON ss.user_id = u.id WHERE u.id IS NULL`,
    },
  ];

  const issues = [];

  for (const check of checks) {
    try {
      const result = await db.query(check.query);
      const count = parseInt(result.rows[0].count);
      const status = count === 0 ? "✓" : "⚠";
      console.log(`  ${status} ${check.name}: ${count}`);
      if (count > 0) issues.push({ check: check.name, count });
    } catch (error) {
      console.log(`  ✗ ${check.name}: ERROR - ${error.message}`);
    }
  }

  return issues;
}

async function verifyDataQuality() {
  console.log("\n--- Data Quality ---");

  const checks = [
    {
      name: "Users with email",
      query: `SELECT COUNT(*) as count FROM users WHERE email IS NOT NULL AND email != ''`,
    },
    {
      name: "Users with display name",
      query: `SELECT COUNT(*) as count FROM users WHERE display_name IS NOT NULL`,
    },
    {
      name: "Active study sessions",
      query: `SELECT COUNT(*) as count FROM study_sessions WHERE is_active = true`,
    },
    {
      name: "Active rooms",
      query: `SELECT COUNT(*) as count FROM rooms WHERE is_active = true`,
    },
    {
      name: "Non-deleted messages",
      query: `SELECT COUNT(*) as count FROM messages WHERE deleted = false`,
    },
  ];

  for (const check of checks) {
    try {
      const result = await db.query(check.query);
      console.log(`  ✓ ${check.name}: ${result.rows[0].count}`);
    } catch (error) {
      console.log(`  ✗ ${check.name}: ERROR - ${error.message}`);
    }
  }
}

async function verifySampleData() {
  console.log("\n--- Sample Data ---");

  const samples = [
    {
      name: "Top 5 users by XP",
      query: `SELECT display_name, email, xp, level FROM users u JOIN user_stats us ON u.id = us.user_id ORDER BY xp DESC LIMIT 5`,
    },
    {
      name: "Most active rooms",
      query: `SELECT name, subject, member_count FROM rooms ORDER BY member_count DESC LIMIT 5`,
    },
    {
      name: "Recent messages",
      query: `SELECT m.content, m.created_at, u.display_name, r.name as room FROM messages m JOIN users u ON m.user_id = u.id JOIN rooms r ON m.room_id = r.id WHERE m.deleted = false ORDER BY m.created_at DESC LIMIT 3`,
    },
  ];

  for (const sample of samples) {
    try {
      const result = await db.query(sample.query);
      console.log(`\n  ${sample.name}:`);
      if (result.rows.length === 0) {
        console.log("    (no data)");
      } else {
        for (const row of result.rows) {
          console.log(`    - ${JSON.stringify(row)}`);
        }
      }
    } catch (error) {
      console.log(`  ✗ ${sample.name}: ERROR - ${error.message}`);
    }
  }
}

async function getMigrationStatus() {
  console.log("\n--- Firebase ID Mapping Status ---");

  const checks = [
    {
      name: "Users with firebase_uid",
      query: `SELECT COUNT(*) as count FROM users WHERE firebase_uid IS NOT NULL`,
    },
    {
      name: "Rooms with firebase_id",
      query: `SELECT COUNT(*) as count FROM rooms WHERE firebase_id IS NOT NULL`,
    },
    {
      name: "Messages with firebase_id",
      query: `SELECT COUNT(*) as count FROM messages WHERE firebase_id IS NOT NULL`,
    },
  ];

  for (const check of checks) {
    try {
      const result = await db.query(check.query);
      console.log(`  ${check.name}: ${result.rows[0].count}`);
    } catch (error) {
      console.log(`  ${check.name}: ERROR`);
    }
  }
}

async function main() {
  console.log("=".repeat(50));
  console.log("MIGRATION VERIFICATION");
  console.log("=".repeat(50));

  try {
    await db.connect();

    await verifyCounts();
    await verifyRelationships();
    await verifyDataQuality();
    await getMigrationStatus();
    await verifySampleData();

    console.log("\n" + "=".repeat(50));
    console.log("VERIFICATION COMPLETE");
    console.log("=".repeat(50));
    console.log("\nIf all checks pass (✓), migration is successful.");
    console.log("If there are warnings (⚠), review the data manually.");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
