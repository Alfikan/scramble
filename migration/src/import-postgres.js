#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { db } from "./database.js";
import { transformer } from "./transform.js";

const BATCH_SIZE = parseInt(process.env.MIGRATION_BATCH_SIZE) || 100;

async function importUsers(data) {
  console.log("\n[1/7] Importing users...");

  const transformed = transformer.transformUsers(data.users);

  if (transformed.users.length > 0) {
    await db.batchInsert(
      "users",
      [
        "id",
        "email",
        "display_name",
        "photo_url",
        "bio",
        "email_verified",
        "level",
        "firebase_uid",
        "created_at",
        "last_login_at",
      ],
      transformed.users.map((u) => [
        u.id,
        u.email,
        u.display_name,
        u.photo_url,
        u.bio,
        u.email_verified,
        u.level,
        u.firebase_uid,
        u.created_at,
        u.last_login_at,
      ]),
      BATCH_SIZE,
    );
  }

  if (transformed.userStats.length > 0) {
    await db.batchInsert(
      "user_stats",
      [
        "user_id",
        "total_study_hours",
        "total_quizzes_taken",
        "average_quiz_score",
        "doubts_raised",
        "doubts_resolved",
        "meetings_attended",
        "current_streak",
        "longest_streak",
        "xp",
        "level",
        "last_study_date",
      ],
      transformed.userStats.map((s) => [
        s.user_id,
        s.total_study_hours,
        s.total_quizzes_taken,
        s.average_quiz_score,
        s.doubts_raised,
        s.doubts_resolved,
        s.meetings_attended,
        s.current_streak,
        s.longest_streak,
        s.xp,
        s.level,
        s.last_study_date,
      ]),
      BATCH_SIZE,
    );
  }

  if (transformed.studyPreferences.length > 0) {
    await db.batchInsert(
      "study_preferences",
      [
        "user_id",
        "focus_music",
        "pomodoro_length",
        "break_length",
        "study_goal_hours_per_week",
      ],
      transformed.studyPreferences.map((p) => [
        p.user_id,
        p.focus_music,
        p.pomodoro_length,
        p.break_length,
        p.study_goal_hours_per_week,
      ]),
      BATCH_SIZE,
    );
  }

  if (transformed.userSubjects.length > 0) {
    await db.batchInsert(
      "user_subjects",
      ["id", "user_id", "subject"],
      transformed.userSubjects.map((s) => [s.id, s.user_id, s.subject]),
      BATCH_SIZE,
    );
  }

  if (transformed.userBadges.length > 0) {
    await db.batchInsert(
      "user_badges",
      ["id", "user_id", "badge_id"],
      transformed.userBadges.map((b) => [b.id, b.user_id, b.badge_id]),
      BATCH_SIZE,
    );
  }

  if (transformed.userAvailability.length > 0) {
    await db.batchInsert(
      "user_availability",
      [
        "id",
        "user_id",
        "day_of_week",
        "start_hour",
        "end_hour",
        "is_available",
      ],
      transformed.userAvailability.map((a) => [
        a.id,
        a.user_id,
        a.day_of_week,
        a.start_hour,
        a.end_hour,
        a.is_available,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importRooms(data) {
  console.log("\n[2/7] Importing rooms...");

  const transformed = transformer.transformRooms(data.rooms, data.users);

  if (transformed.rooms.length > 0) {
    await db.batchInsert(
      "rooms",
      [
        "id",
        "name",
        "description",
        "subject",
        "is_public",
        "is_active",
        "created_by",
        "firebase_id",
        "member_count",
        "created_at",
        "updated_at",
      ],
      transformed.rooms.map((r) => [
        r.id,
        r.name,
        r.description,
        r.subject,
        r.is_public,
        r.is_active,
        r.created_by,
        r.firebase_id,
        r.member_count,
        r.created_at,
        r.updated_at,
      ]),
      BATCH_SIZE,
    );
  }

  if (transformed.roomMembers.length > 0) {
    await db.batchInsert(
      "room_members",
      ["id", "room_id", "user_id", "role", "joined_at"],
      transformed.roomMembers.map((m) => [
        m.id,
        m.room_id,
        m.user_id,
        m.role,
        m.joined_at,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importMessages(data) {
  console.log("\n[3/7] Importing messages...");

  const transformed = transformer.transformMessages(data.messages);

  if (transformed.messages.length > 0) {
    await db.batchInsert(
      "messages",
      [
        "id",
        "room_id",
        "user_id",
        "user_name",
        "user_avatar",
        "content",
        "message_type",
        "edited",
        "deleted",
        "firebase_id",
        "created_at",
      ],
      transformed.messages.map((m) => [
        m.id,
        m.room_id,
        m.user_id,
        m.user_name,
        m.user_avatar,
        m.content,
        m.message_type,
        m.edited,
        m.deleted,
        m.firebase_id,
        m.created_at,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importResources(data) {
  console.log("\n[4/7] Importing resources...");

  const transformed = transformer.transformResources(data.resources);

  if (transformed.resources.length > 0) {
    await db.batchInsert(
      "resources",
      [
        "id",
        "room_id",
        "user_id",
        "user_name",
        "file_name",
        "file_size",
        "file_type",
        "storage_key",
        "download_url",
        "firebase_id",
        "uploaded_at",
      ],
      transformed.resources.map((r) => [
        r.id,
        r.room_id,
        r.user_id,
        r.user_name,
        r.file_name,
        r.file_size,
        r.file_type,
        r.storage_key,
        r.download_url,
        r.firebase_id,
        r.uploaded_at,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importStudySessions(data) {
  console.log("\n[5/7] Importing study sessions...");

  const transformed = transformer.transformStudySessions(data.studySessions);

  if (transformed.studySessions.length > 0) {
    await db.batchInsert(
      "study_sessions",
      [
        "id",
        "user_id",
        "room_id",
        "subject",
        "start_time",
        "end_time",
        "duration_minutes",
        "is_active",
        "notes",
        "firebase_id",
        "created_at",
      ],
      transformed.studySessions.map((s) => [
        s.id,
        s.user_id,
        s.room_id,
        s.subject,
        s.start_time,
        s.end_time,
        s.duration_minutes,
        s.is_active,
        s.notes,
        s.firebase_id,
        s.created_at,
      ]),
      BATCH_SIZE,
    );
  }

  if (transformed.sessionBreaks.length > 0) {
    await db.batchInsert(
      "session_breaks",
      ["id", "session_id", "start_time", "end_time", "duration_minutes"],
      transformed.sessionBreaks.map((b) => [
        b.id,
        b.session_id,
        b.start_time,
        b.end_time,
        b.duration_minutes,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importQuizAttempts(data) {
  console.log("\n[6/7] Importing quiz attempts...");

  const transformed = transformer.transformQuizAttempts(data.quizAttempts);

  if (transformed.quizAttempts.length > 0) {
    await db.batchInsert(
      "quiz_attempts",
      [
        "id",
        "user_id",
        "quiz_title",
        "score",
        "total_questions",
        "correct_answers",
        "firebase_id",
        "completed_at",
      ],
      transformed.quizAttempts.map((q) => [
        q.id,
        q.user_id,
        q.quiz_title,
        q.score,
        q.total_questions,
        q.correct_answers,
        q.firebase_id,
        q.completed_at,
      ]),
      BATCH_SIZE,
    );
  }

  return transformed;
}

async function importOAuthAccounts(data) {
  console.log("\n[7/7] OAuth accounts...");
  console.log(
    "  (Note: OAuth data needs to be migrated separately from Firebase Auth exports)",
  );
  console.log(
    "  Run: node src/migrate-oauth.js if you have Firebase Auth user data",
  );
}

async function main() {
  console.log("=".repeat(50));
  console.log("POSTGRESQL IMPORT");
  console.log("=".repeat(50));
  console.log(`Target: Neon DB`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log("");

  let data;
  try {
    const fs = await import("fs/promises");
    const fileContent = await fs.readFile("firestore-export.json", "utf-8");
    data = JSON.parse(fileContent);
    console.log("Loaded exported data from firestore-export.json");
  } catch (error) {
    console.error("Failed to load firestore-export.json:", error.message);
    console.error("Run: npm run export-firestore first");
    process.exit(1);
  }

  const startTime = Date.now();

  try {
    await db.connect();

    await importUsers(data);
    await importRooms(data);
    await importMessages(data);
    await importResources(data);
    await importStudySessions(data);
    await importQuizAttempts(data);
    await importOAuthAccounts(data);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n" + "=".repeat(50));
    console.log("IMPORT COMPLETE");
    console.log("=".repeat(50));
    console.log(`Duration: ${duration}s`);
    console.log("\nNext steps:");
    console.log("  1. Run: npm run verify   - Check migration integrity");
    console.log("  2. Update app config    - Point to new PostgreSQL backend");
    console.log("  3. Test authentication  - Verify login works");
  } catch (error) {
    console.error("\nImport failed:", error);
    console.error("\nTo rollback: npm run rollback");
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
