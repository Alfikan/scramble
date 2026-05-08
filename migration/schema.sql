-- ============================================
-- SCRAMBLE APP - PostgreSQL Schema for Neon DB
-- Migration from Firebase Firestore
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');
CREATE TYPE oauth_provider AS ENUM ('google', 'email');

-- ============================================
-- TABLE: users
-- Replaces: Firebase Auth user + Firestore users collection
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    photo_url TEXT,
    bio TEXT DEFAULT '',
    email_verified BOOLEAN DEFAULT FALSE,
    level user_level DEFAULT 'beginner',
    
    -- Firebase Auth userId mapping (for migration reference)
    firebase_uid VARCHAR(128),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid) WHERE firebase_uid IS NOT NULL;
CREATE INDEX idx_users_created ON users(created_at DESC);

-- ============================================
-- TABLE: oauth_accounts
-- Replaces: Firebase Auth OAuth linking
-- ============================================
CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider oauth_provider NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_user ON oauth_accounts(user_id);

-- ============================================
-- TABLE: refresh_tokens
-- For JWT session management
-- ============================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================
-- TABLE: user_subjects
-- Extracted from: users[].subjects (array)
-- ============================================
CREATE TABLE user_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, subject)
);

CREATE INDEX idx_user_subjects_user ON user_subjects(user_id);

-- ============================================
-- TABLE: user_badges
-- Extracted from: users[].badges (array)
-- ============================================
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(50) NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- ============================================
-- TABLE: user_stats
-- Extracted from: users[].stats (nested object)
-- ============================================
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_study_hours DECIMAL(10,2) DEFAULT 0,
    total_quizzes_taken INTEGER DEFAULT 0,
    average_quiz_score DECIMAL(5,2) DEFAULT 0,
    doubts_raised INTEGER DEFAULT 0,
    doubts_resolved INTEGER DEFAULT 0,
    meetings_attended INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level user_level DEFAULT 'beginner',
    last_study_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_stats_xp ON user_stats(xp DESC);

-- ============================================
-- TABLE: study_preferences
-- Extracted from: users[].studyPreferences (nested object)
-- ============================================
CREATE TABLE study_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    focus_music BOOLEAN DEFAULT FALSE,
    pomodoro_length INTEGER DEFAULT 25,
    break_length INTEGER DEFAULT 5,
    study_goal_hours_per_week DECIMAL(5,2) DEFAULT 20
);

-- ============================================
-- TABLE: user_availability
-- Extracted from: users[].availability (nested object)
-- ============================================
CREATE TABLE user_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_hour SMALLINT CHECK (start_hour BETWEEN 0 AND 23),
    end_hour SMALLINT CHECK (end_hour BETWEEN 0 AND 23),
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, day_of_week)
);

CREATE INDEX idx_user_availability_user ON user_availability(user_id);

-- ============================================
-- TABLE: rooms
-- Replaces: Firestore rooms collection
-- ============================================
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    
    -- Firebase document ID for migration reference
    firebase_id VARCHAR(128),
    
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rooms_public_active ON rooms(is_public, is_active) WHERE is_public = TRUE;
CREATE INDEX idx_rooms_created_by ON rooms(created_by);
CREATE INDEX idx_rooms_created ON rooms(created_at DESC);
CREATE INDEX idx_rooms_firebase_id ON rooms(firebase_id) WHERE firebase_id IS NOT NULL;

-- ============================================
-- TABLE: room_members
-- Replaces: rooms[].members (array of userIds)
-- ============================================
CREATE TABLE room_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    role VARCHAR(20) DEFAULT 'member',
    UNIQUE(room_id, user_id)
);

CREATE INDEX idx_room_members_room ON room_members(room_id);
CREATE INDEX idx_room_members_user ON room_members(user_id);

-- ============================================
-- TABLE: messages
-- Replaces: Firestore messages collection
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    edited BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE,
    
    -- Firebase document ID for migration reference
    firebase_id VARCHAR(128),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_room_created ON messages(room_id, created_at ASC) WHERE deleted = FALSE;
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_firebase_id ON messages(firebase_id) WHERE firebase_id IS NOT NULL;

-- ============================================
-- TABLE: resources
-- Replaces: Firestore resources collection
-- Note: Files should be migrated separately to S3/R2
-- ============================================
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    user_name VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    download_url TEXT,
    
    -- Firebase document ID for migration reference
    firebase_id VARCHAR(128),
    
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resources_room ON resources(room_id);
CREATE INDEX idx_resources_room_uploaded ON resources(room_id, uploaded_at DESC);
CREATE INDEX idx_resources_firebase_id ON resources(firebase_id) WHERE firebase_id IS NOT NULL;

-- ============================================
-- TABLE: study_sessions
-- Replaces: Firestore studySessions collection
-- ============================================
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    subject VARCHAR(100) DEFAULT 'General',
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    
    -- Firebase document ID for migration reference
    firebase_id VARCHAR(128),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_duration CHECK (end_time IS NULL OR end_time > start_time)
);

CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_user_start ON study_sessions(user_id, start_time DESC);
CREATE INDEX idx_study_sessions_active ON study_sessions(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_study_sessions_room ON study_sessions(room_id) WHERE room_id IS NOT NULL;
CREATE INDEX idx_study_sessions_firebase_id ON study_sessions(firebase_id) WHERE firebase_id IS NOT NULL;

-- ============================================
-- TABLE: session_breaks
-- Extracted from: studySessions[].breaks (array of objects)
-- ============================================
CREATE TABLE session_breaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    CONSTRAINT valid_break CHECK (end_time IS NULL OR end_time > start_time)
);

CREATE INDEX idx_session_breaks_session ON session_breaks(session_id);

-- ============================================
-- TABLE: quiz_attempts
-- Replaces: Firestore quizAttempts collection
-- ============================================
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_title VARCHAR(255) NOT NULL,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    
    -- Firebase document ID for migration reference
    firebase_id VARCHAR(128),
    
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_user_completed ON quiz_attempts(user_id, completed_at DESC);
CREATE INDEX idx_quiz_attempts_firebase_id ON quiz_attempts(firebase_id) WHERE firebase_id IS NOT NULL;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_study_sessions_updated_at
    BEFORE UPDATE ON study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- MIGRATION HELPER VIEWS
-- ============================================

-- View to check migration status
CREATE VIEW migration_status AS
SELECT 
    'users' as table_name,
    COUNT(*) as total_count,
    COUNT(firebase_uid) as migrated_count,
    COUNT(firebase_uid) * 100.0 / NULLIF(COUNT(*), 0) as migration_percentage
FROM users
UNION ALL
SELECT 
    'rooms' as table_name,
    COUNT(*) as total_count,
    COUNT(firebase_id) as migrated_count,
    COUNT(firebase_id) * 100.0 / NULLIF(COUNT(*), 0) as migration_percentage
FROM rooms
UNION ALL
SELECT 
    'messages' as table_name,
    COUNT(*) as total_count,
    COUNT(firebase_id) as migrated_count,
    COUNT(firebase_id) * 100.0 / NULLIF(COUNT(*), 0) as migration_percentage
FROM messages;
