-- Schema for SolidWorks & Altium Workshop Registration (PERN / Supabase)

-- 1. Workshops Table
CREATE TABLE IF NOT EXISTS workshops (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL DEFAULT 'workshopreg2',
  title VARCHAR(255) NOT NULL DEFAULT 'SolidWorks 3D CAD & Altium ECAD Co-Design Workshop',
  subtitle TEXT DEFAULT 'Hands-on training bridging 3D mechanical enclosure engineering and high-speed PCB design',
  event_date VARCHAR(100) DEFAULT 'October 24-26, 2026',
  location VARCHAR(150) DEFAULT 'Main Hardware Lab & Virtual Interactive Stream',
  total_lab_seats INTEGER NOT NULL DEFAULT 60,
  booked_lab_seats INTEGER NOT NULL DEFAULT 44,
  solidworks_seats_left INTEGER NOT NULL DEFAULT 8,
  altium_seats_left INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  registration_id VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(50),
  institution VARCHAR(180) NOT NULL,
  reg_number VARCHAR(80),
  department VARCHAR(100) NOT NULL,
  year_or_role VARCHAR(60) NOT NULL,
  track VARCHAR(50) NOT NULL, -- 'solidworks', 'altium', or 'both_mechatronics'
  attendance_mode VARCHAR(50) DEFAULT 'in_person', -- 'in_person' or 'virtual'
  experience_level VARCHAR(50) DEFAULT 'Intermediate',
  license_assistance BOOLEAN DEFAULT true,
  project_interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Seed workshop row if not exists
INSERT INTO workshops (slug, title, subtitle, event_date, location, total_lab_seats, booked_lab_seats, solidworks_seats_left, altium_seats_left)
VALUES (
  'workshopreg2',
  'SolidWorks 3D CAD & Altium ECAD Co-Design Workshop',
  'Hands-on training bridging 3D mechanical enclosure engineering and high-speed PCB design',
  'October 24-26, 2026',
  'Main Hardware Lab & Virtual Interactive Stream',
  60,
  44,
  8,
  8
)
ON CONFLICT (slug) DO NOTHING;
