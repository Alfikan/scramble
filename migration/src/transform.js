import { v4 as uuidv4 } from "uuid";

class DataTransformer {
  constructor() {
    this.userIdMap = new Map();
    this.roomIdMap = new Map();
    this.sessionIdMap = new Map();
  }

  reset() {
    this.userIdMap.clear();
    this.roomIdMap.clear();
    this.sessionIdMap.clear();
  }

  transformUsers(users) {
    console.log(`Transforming ${users.length} users...`);

    const transformed = {
      users: [],
      userSubjects: [],
      userBadges: [],
      userStats: [],
      studyPreferences: [],
      userAvailability: [],
    };

    for (const user of users) {
      const { _id, _data } = user;
      const newId = uuidv4();

      this.userIdMap.set(_id, newId);

      transformed.users.push({
        id: newId,
        email: _data.email || "",
        display_name: _data.displayName || null,
        photo_url: _data.photoURL || null,
        bio: _data.bio || "",
        email_verified: _data.emailVerified || false,
        level: this.mapLevel(_data.stats?.level || 1),
        firebase_uid: _id,
        created_at: this.toTimestamp(_data.createdAt),
        last_login_at: this.toTimestamp(_data.lastLoginAt),
      });

      if (_data.subjects && Array.isArray(_data.subjects)) {
        for (const subject of _data.subjects) {
          transformed.userSubjects.push({
            id: uuidv4(),
            user_id: newId,
            subject: subject,
          });
        }
      }

      if (_data.badges && Array.isArray(_data.badges)) {
        for (const badgeId of _data.badges) {
          transformed.userBadges.push({
            id: uuidv4(),
            user_id: newId,
            badge_id: badgeId,
          });
        }
      }

      transformed.userStats.push({
        user_id: newId,
        total_study_hours: _data.stats?.totalStudyHours || 0,
        total_quizzes_taken: _data.stats?.totalQuizzesTaken || 0,
        average_quiz_score: _data.stats?.averageQuizScore || 0,
        doubts_raised: _data.stats?.doubtsRaised || 0,
        doubts_resolved: _data.stats?.doubtsResolved || 0,
        meetings_attended: _data.stats?.meetingsAttended || 0,
        current_streak: _data.stats?.currentStreak || 0,
        longest_streak: _data.stats?.longestStreak || 0,
        xp: _data.stats?.xp || 0,
        level: this.mapLevel(_data.stats?.level || 1),
        last_study_date: _data.lastStudyDate
          ? this.toDate(_data.lastStudyDate)
          : null,
      });

      transformed.studyPreferences.push({
        user_id: newId,
        focus_music: _data.studyPreferences?.focusMusic || false,
        pomodoro_length: _data.studyPreferences?.pomodoroLength || 25,
        break_length: _data.studyPreferences?.breakLength || 5,
        study_goal_hours_per_week:
          _data.studyPreferences?.studyGoalHoursPerWeek || 20,
      });

      if (_data.availability) {
        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        for (let i = 0; i < days.length; i++) {
          const dayData = _data.availability[days[i]];
          if (dayData && Array.isArray(dayData) && dayData.length >= 2) {
            transformed.userAvailability.push({
              id: uuidv4(),
              user_id: newId,
              day_of_week: i,
              start_hour: dayData[0],
              end_hour: dayData[1],
              is_available: dayData[0] !== null && dayData[1] !== null,
            });
          }
        }
      }
    }

    console.log(`  -> ${transformed.users.length} users`);
    console.log(`  -> ${transformed.userSubjects.length} subjects`);
    console.log(`  -> ${transformed.userBadges.length} badges`);
    console.log(`  -> ${transformed.userStats.length} stats`);
    console.log(`  -> ${transformed.studyPreferences.length} preferences`);
    console.log(
      `  -> ${transformed.userAvailability.length} availability entries`,
    );

    return transformed;
  }

  transformRooms(rooms, usersData) {
    console.log(`Transforming ${rooms.length} rooms...`);

    const transformed = {
      rooms: [],
      roomMembers: [],
    };

    for (const room of rooms) {
      const { _id, _data } = room;
      const newId = uuidv4();

      this.roomIdMap.set(_id, newId);

      const createdByNewId = this.userIdMap.get(_data.createdBy) || null;

      transformed.rooms.push({
        id: newId,
        name: _data.name || "Unnamed Room",
        description: _data.description || null,
        subject: _data.subject || null,
        is_public: _data.isPublic ?? true,
        is_active: _data.isActive ?? true,
        created_by: createdByNewId,
        firebase_id: _id,
        member_count: _data.memberCount || 0,
        created_at: this.toTimestamp(_data.createdAt),
        updated_at: this.toTimestamp(_data.updatedAt),
      });

      if (_data.members && Array.isArray(_data.members)) {
        for (const memberFirebaseId of _data.members) {
          const memberNewId = this.userIdMap.get(memberFirebaseId);
          if (memberNewId) {
            const role =
              memberFirebaseId === _data.createdBy ? "owner" : "member";
            transformed.roomMembers.push({
              id: uuidv4(),
              room_id: newId,
              user_id: memberNewId,
              role: role,
              joined_at: this.toTimestamp(_data.createdAt),
            });
          }
        }
      }
    }

    console.log(`  -> ${transformed.rooms.length} rooms`);
    console.log(`  -> ${transformed.roomMembers.length} room memberships`);

    return transformed;
  }

  transformMessages(messages) {
    console.log(`Transforming ${messages.length} messages...`);

    const transformed = {
      messages: [],
    };

    for (const msg of messages) {
      const { _id, _data } = msg;
      const newId = uuidv4();

      const userNewId = this.userIdMap.get(_data.userId);
      const roomNewId = this.roomIdMap.get(_data.roomId);

      if (!userNewId || !roomNewId) {
        console.warn(`  Skipping message ${_id}: missing user or room mapping`);
        continue;
      }

      transformed.messages.push({
        id: newId,
        room_id: roomNewId,
        user_id: userNewId,
        user_name: _data.userName || "Unknown",
        user_avatar: _data.userAvatar || null,
        content: _data.text || "",
        message_type: _data.messageType || "text",
        edited: _data.edited || false,
        deleted: _data.deleted || false,
        firebase_id: _id,
        created_at: this.toTimestamp(_data.timestamp),
      });
    }

    console.log(`  -> ${transformed.messages.length} messages`);

    return transformed;
  }

  transformResources(resources) {
    console.log(`Transforming ${resources.length} resources...`);

    const transformed = {
      resources: [],
    };

    for (const resource of resources) {
      const { _id, _data } = resource;
      const newId = uuidv4();

      const userNewId = this.userIdMap.get(_data.userId);
      const roomNewId = this.roomIdMap.get(_data.roomId);

      if (!userNewId || !roomNewId) {
        console.warn(
          `  Skipping resource ${_id}: missing user or room mapping`,
        );
        continue;
      }

      transformed.resources.push({
        id: newId,
        room_id: roomNewId,
        user_id: userNewId,
        user_name: _data.userName || "Unknown",
        file_name: _data.fileName || "unknown",
        file_size: _data.fileSize || 0,
        file_type: _data.fileType || "application/octet-stream",
        storage_key: _data.storagePath || "",
        download_url: _data.downloadURL || null,
        firebase_id: _id,
        uploaded_at: this.toTimestamp(_data.uploadedAt),
      });
    }

    console.log(`  -> ${transformed.resources.length} resources`);

    return transformed;
  }

  transformStudySessions(sessions) {
    console.log(`Transforming ${sessions.length} study sessions...`);

    const transformed = {
      studySessions: [],
      sessionBreaks: [],
    };

    for (const session of sessions) {
      const { _id, _data } = session;
      const newId = uuidv4();

      this.sessionIdMap.set(_id, newId);

      const userNewId = this.userIdMap.get(_data.userId);
      const roomNewId = _data.roomId ? this.roomIdMap.get(_data.roomId) : null;

      if (!userNewId) {
        console.warn(`  Skipping session ${_id}: missing user mapping`);
        continue;
      }

      const startTime = this.toTimestamp(_data.startTime);
      const endTime = this.toTimestamp(_data.endTime);
      const durationMinutes =
        endTime && startTime
          ? Math.round((new Date(endTime) - new Date(startTime)) / 60000)
          : null;

      transformed.studySessions.push({
        id: newId,
        user_id: userNewId,
        room_id: roomNewId,
        subject: _data.subject || "General",
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        is_active: _data.isActive ?? false,
        notes: _data.notes || null,
        firebase_id: _id,
        created_at: this.toTimestamp(_data.createdAt),
      });

      if (_data.breaks && Array.isArray(_data.breaks)) {
        for (const brk of _data.breaks) {
          const breakStart = this.toTimestamp(brk.startTime);
          const breakEnd = this.toTimestamp(brk.endTime);
          const breakDuration =
            breakEnd && breakStart
              ? Math.round((new Date(breakEnd) - new Date(breakStart)) / 60000)
              : null;

          transformed.sessionBreaks.push({
            id: uuidv4(),
            session_id: newId,
            start_time: breakStart,
            end_time: breakEnd,
            duration_minutes: breakDuration,
          });
        }
      }
    }

    console.log(`  -> ${transformed.studySessions.length} sessions`);
    console.log(`  -> ${transformed.sessionBreaks.length} breaks`);

    return transformed;
  }

  transformQuizAttempts(attempts) {
    console.log(`Transforming ${attempts.length} quiz attempts...`);

    const transformed = {
      quizAttempts: [],
    };

    for (const attempt of attempts) {
      const { _id, _data } = attempt;
      const newId = uuidv4();

      const userNewId = this.userIdMap.get(_data.userId);

      if (!userNewId) {
        console.warn(`  Skipping quiz attempt ${_id}: missing user mapping`);
        continue;
      }

      transformed.quizAttempts.push({
        id: newId,
        user_id: userNewId,
        quiz_title: _data.quizTitle || "Untitled Quiz",
        score: _data.score || 0,
        total_questions: _data.totalQuestions || 0,
        correct_answers: _data.correctAnswers || 0,
        firebase_id: _id,
        completed_at: this.toTimestamp(_data.completedAt),
      });
    }

    console.log(`  -> ${transformed.quizAttempts.length} quiz attempts`);

    return transformed;
  }

  toTimestamp(firebaseTimestamp) {
    if (!firebaseTimestamp) return null;
    if (firebaseTimestamp instanceof Date) return firebaseTimestamp;
    if (firebaseTimestamp.toDate) return firebaseTimestamp.toDate();
    if (typeof firebaseTimestamp === "string")
      return new Date(firebaseTimestamp);
    if (typeof firebaseTimestamp === "number")
      return new Date(firebaseTimestamp);
    return null;
  }

  toDate(firebaseTimestamp) {
    const date = this.toTimestamp(firebaseTimestamp);
    return date ? date.toISOString().split("T")[0] : null;
  }

  mapLevel(level) {
    if (typeof level === "string") return level;
    if (level >= 20) return "expert";
    if (level >= 10) return "advanced";
    if (level >= 5) return "intermediate";
    return "beginner";
  }
}

export const transformer = new DataTransformer();
export default transformer;
