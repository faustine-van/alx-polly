-- Supabase Database Schema for Polling Application

-- Enable Row Level Security (RLS) extension
-- This is automatically enabled in Supabase projects

-- 1. POLLS TABLE
-- Stores poll information with questions and options
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VOTES TABLE
-- Stores individual votes for poll options
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow anonymous voting
    option_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for better query performance
CREATE INDEX idx_polls_user_id ON polls(user_id);
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_created_at ON votes(created_at);

-- TRIGGERS for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON polls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- POLLS TABLE POLICIES

-- Allow users to read all polls (public access)
CREATE POLICY "Anyone can view polls" ON polls
    FOR SELECT
    USING (true);

-- Allow authenticated users to create polls
CREATE POLICY "Authenticated users can create polls" ON polls
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own polls
CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own polls
CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE
    USING (auth.uid() = user_id);

-- VOTES TABLE POLICIES

-- Allow anyone to view votes (for displaying results)
CREATE POLICY "Anyone can view votes" ON votes
    FOR SELECT
    USING (true);

-- Allow anyone to insert votes (anonymous voting allowed)
CREATE POLICY "Anyone can vote" ON votes
    FOR INSERT
    WITH CHECK (true);

-- Prevent users from updating or deleting votes (integrity)
-- No UPDATE or DELETE policies = no one can modify votes

-- Note: Vote counting and results display is handled in the application layer
-- No additional views or functions needed for your current implementation

-- OPTIONAL: Add constraint to ensure option_index is valid
-- This would require checking against the options array length
-- You can add this constraint if needed:
-- ALTER TABLE votes ADD CONSTRAINT check_valid_option_index 
-- CHECK (option_index >= 0);

-- OPTIONAL: Add unique constraint to prevent multiple votes from same user on same poll
-- Uncomment if you want to prevent duplicate voting:
-- CREATE UNIQUE INDEX unique_user_poll_vote ON votes(poll_id, user_id) WHERE user_id IS NOT NULL;

-- SAMPLE DATA (for testing - remove in production)
-- Note: You'll need to replace 'your-user-uuid-here' with actual user UUIDs from auth.users

/*
INSERT INTO polls (user_id, question, options) VALUES 
('your-user-uuid-here', 'What is your favorite programming language?', 
 '["JavaScript", "Python", "TypeScript", "Go", "Rust"]'::jsonb),
('your-user-uuid-here', 'Best time for a team meeting?', 
 '["9 AM", "10 AM", "2 PM", "3 PM"]'::jsonb);
*/