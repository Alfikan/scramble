#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { exporter } from "./firebase.js";

async function main() {
  const skipCollections = process.env.SKIP_COLLECTIONS
    ? process.env.SKIP_COLLECTIONS.split(",")
    : [];

  const batchSize = parseInt(process.env.MIGRATION_BATCH_SIZE) || 500;

  console.log("=".repeat(50));
  console.log("FIRESTORE EXPORT");
  console.log("=".repeat(50));
  console.log(`Project: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(
    `Skip collections: ${skipCollections.length > 0 ? skipCollections.join(", ") : "none"}`,
  );
  console.log(`Batch size: ${batchSize}`);
  console.log("");

  try {
    const data = await exporter.exportAllCollections({
      skipCollections,
      batchSize,
    });

    const stats = exporter.getCollectionStats();
    console.log("\nExport Summary:");
    console.log("-".repeat(30));
    for (const [name, info] of Object.entries(stats)) {
      console.log(`  ${name}: ${info.count} documents`);
    }

    const exportPath = await exporter.saveToJson("firestore-export.json");
    console.log(`\nExported data saved to: ${exportPath}`);

    return data;
  } catch (error) {
    console.error("Export failed:", error);
    process.exit(1);
  }
}

main();
