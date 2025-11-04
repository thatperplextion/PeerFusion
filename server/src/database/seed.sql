-- Sample seed data for PeerFusion (optional)
-- Insert a sample user and a couple of skills for demo

INSERT INTO users (email, password_hash, first_name, last_name, is_verified, is_active)
VALUES ('demo@peerfusion.local', '$2b$10$7Qj3KqC6uY1Yp1Qx9VdZ7uHq8J9Zp4vQw3y8KxGv1ZpQ6b8YtF/3e', 'Demo', 'User', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO skills (name, category, description)
VALUES ('Data Analysis', 'technical', 'Statistical analysis and data visualization'),
       ('LaTeX', 'technical', 'Document preparation and typesetting for academic papers')
ON CONFLICT (name) DO NOTHING;

-- Link demo user to a skill (user_skills)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE email='demo@peerfusion.local') THEN
    INSERT INTO user_skills (user_id, skill_id, proficiency_level, skill_type)
    SELECT u.id, s.id, 4, 'offering'
    FROM users u, skills s
    WHERE u.email='demo@peerfusion.local' AND s.name='Data Analysis'
    ON CONFLICT (user_id, skill_id, skill_type) DO NOTHING;
  END IF;
END$$;
