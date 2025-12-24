-- ============================================================================
-- SeniorConnect Database Schema
-- Multi-tenant architecture with app_id isolation
-- ============================================================================

-- ============================================================================
-- SHARED TABLES (no app_id - these are shared across all apps)
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_registry (
  app_id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  app_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_app_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL REFERENCES app_registry(app_id),
  first_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- APP-ISOLATED TABLES (have app_id column for multi-tenant isolation)
-- ============================================================================

-- Family Circles - Groups of connected family members
CREATE TABLE IF NOT EXISTS family_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family Members - Members within a circle
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  circle_id UUID REFERENCES family_circles(id) ON DELETE CASCADE,
  member_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'caregiver', 'member')),
  nickname TEXT,
  relationship TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts - Emergency and favorite contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  relationship TEXT,
  is_emergency BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Reminders
CREATE TABLE IF NOT EXISTS medication_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT NOT NULL,
  times TEXT[] NOT NULL,
  days_of_week INTEGER[],
  start_date DATE,
  end_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Logs - Track when medication was taken
CREATE TABLE IF NOT EXISTS medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  reminder_id UUID REFERENCES medication_reminders(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  taken_at TIMESTAMPTZ,
  skipped BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment Reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  doctor_name TEXT,
  notes TEXT,
  reminder_before INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared Photos
CREATE TABLE IF NOT EXISTS shared_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  circle_id UUID REFERENCES family_circles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  circle_id UUID REFERENCES family_circles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  font_size TEXT DEFAULT 'large' CHECK (font_size IN ('normal', 'large', 'extra-large')),
  high_contrast BOOLEAN DEFAULT false,
  reminder_sound TEXT DEFAULT 'gentle',
  emergency_contact_id UUID REFERENCES contacts(id),
  show_activity_status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_app_context ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Family Circles policies
CREATE POLICY "Users can manage own circles" ON family_circles
  FOR ALL USING (auth.uid() = user_id);

-- Family Members policies
CREATE POLICY "Users can manage own family members" ON family_members
  FOR ALL USING (auth.uid() = user_id);

-- Contacts policies
CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

-- Medication Reminders policies
CREATE POLICY "Users can manage own reminders" ON medication_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Medication Logs policies
CREATE POLICY "Users can manage own medication logs" ON medication_logs
  FOR ALL USING (auth.uid() = user_id);

-- Appointment Reminders policies
CREATE POLICY "Users can manage own appointments" ON appointment_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Shared Photos policies
CREATE POLICY "Users can manage own photos" ON shared_photos
  FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- User Settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- User App Context policies
CREATE POLICY "Users can manage own app context" ON user_app_context
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_family_circles_user ON family_circles(user_id);
CREATE INDEX IF NOT EXISTS idx_family_circles_app_id ON family_circles(app_id);
CREATE INDEX IF NOT EXISTS idx_family_members_circle ON family_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_emergency ON contacts(user_id, is_emergency);
CREATE INDEX IF NOT EXISTS idx_medication_reminders_user ON medication_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_medication_reminders_active ON medication_reminders(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_date ON appointment_reminders(appointment_date);
CREATE INDEX IF NOT EXISTS idx_shared_photos_circle ON shared_photos(circle_id);
CREATE INDEX IF NOT EXISTS idx_messages_circle ON messages(circle_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate invite code for family circles
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REGISTER APP
-- ============================================================================

INSERT INTO app_registry (app_id, app_name, app_category)
VALUES ('seniorconnect', 'SeniorConnect', 'social')
ON CONFLICT (app_id) DO NOTHING;
