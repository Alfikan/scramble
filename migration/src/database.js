import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (this.pool) return this.pool;

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("error", (err) => {
      console.error("Unexpected database error:", err);
    });

    const client = await this.pool.connect();
    console.log("Connected to PostgreSQL/Neon");
    client.release();

    return this.pool;
  }

  async query(text, params) {
    const start = Date.now();
    const result = await this.pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.MIGRATION_VERBOSE === "true") {
      console.log("Executed query", {
        text: text.substring(0, 100),
        duration,
        rows: result.rowCount,
      });
    }

    return result;
  }

  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async batchInsert(tableName, columns, values, batchSize = 100) {
    const results = [];

    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);
      const placeholders = batch
        .map((_, rowIndex) => {
          const rowPlaceholders = columns
            .map(
              (_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`,
            )
            .join(", ");
          return `(${rowPlaceholders})`;
        })
        .join(", ");

      const flatValues = batch.flat();

      try {
        const result = await this.query(
          `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES ${placeholders}`,
          flatValues,
        );
        results.push(result);
        console.log(
          `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(values.length / batchSize)} (${batch.length} rows)`,
        );
      } catch (error) {
        console.error(
          `Batch insert failed at batch ${Math.floor(i / batchSize) + 1}:`,
          error.message,
        );
        throw error;
      }
    }

    return results;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log("Database connection closed");
    }
  }
}

export const db = new Database();
export default db;
