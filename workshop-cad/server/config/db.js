import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isConnectedToDb = false;

// In-memory store for development/preview before Supabase connection string is supplied
const inMemoryStore = {
  workshop: {
    id: 1,
    slug: 'workshopreg2',
    title: 'SolidWorks 3D CAD & Altium ECAD Co-Design Workshop',
    subtitle: 'Hands-on training bridging 3D mechanical enclosure engineering and high-speed PCB design',
    event_date: 'October 24-26, 2026',
    location: 'Main Hardware Lab & Virtual Interactive Stream',
    total_lab_seats: 60,
    booked_lab_seats: 44,
    solidworks_seats_left: 8,
    altium_seats_left: 8,
    created_at: new Date().toISOString()
  },
  registrations: [
    {
      id: 1,
      registration_id: 'REG-MCAD-98214',
      full_name: 'Aditya Sharma',
      email: 'aditya.s@srmist.edu.in',
      phone: '+91 98765 43210',
      institution: 'SRM Institute of Science & Technology',
      reg_number: 'RA2211003010482',
      department: 'Mechatronics Engineering',
      year_or_role: '3rd Year B.Tech',
      track: 'both_mechatronics',
      attendance_mode: 'in_person',
      experience_level: 'Intermediate',
      license_assistance: true,
      project_interest: 'Autonomous ground rover chassis & custom motor controller PCB',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: 2,
      registration_id: 'REG-ALT-73190',
      full_name: 'Pooja Narayanan',
      email: 'pooja.n@mit.edu',
      phone: '+91 94455 12389',
      institution: 'Madras Institute of Technology',
      reg_number: 'MIT-ECE-2023-89',
      department: 'Electronics & Communication',
      year_or_role: 'Final Year B.E.',
      track: 'altium',
      attendance_mode: 'in_person',
      experience_level: 'Advanced',
      license_assistance: false,
      project_interest: '56Gbps SerDes routing & DDR5 memory layout for edge AI compute',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ]
};

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (connectionString && !connectionString.includes('YOUR_')) {
  try {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000
    });
  } catch (err) {
    console.warn('[Supabase/PostgreSQL] Pool initialization warning:', err.message);
  }
}

export async function initDb() {
  if (!pool) {
    console.log('⚡ [Database] Running in Resilient Mode. Connect Supabase by setting DATABASE_URL in .env');
    return;
  }

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    isConnectedToDb = true;
    console.log(`✅ [Supabase/PostgreSQL] Connected successfully! Server time: ${res.rows[0].now}`);

    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ [Supabase/PostgreSQL] Workshop schema initialized.');
    }
  } catch (err) {
    console.warn('⚠️ [Supabase/PostgreSQL] Could not connect to remote DB. Running in local memory store.');
    console.warn('   Details:', err.message);
    isConnectedToDb = false;
  }
}

export const db = {
  isSupabaseConnected: () => isConnectedToDb,

  async getWorkshop() {
    if (isConnectedToDb && pool) {
      try {
        const res = await pool.query('SELECT * FROM workshops WHERE slug = $1 LIMIT 1', ['workshopreg2']);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.error('[DB Error - getWorkshop]:', err.message);
      }
    }
    return inMemoryStore.workshop;
  },

  async getRegistrations() {
    if (isConnectedToDb && pool) {
      try {
        const res = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC LIMIT 50');
        return res.rows;
      } catch (err) {
        console.error('[DB Error - getRegistrations]:', err.message);
      }
    }
    return inMemoryStore.registrations;
  },

  async createRegistration(data) {
    if (isConnectedToDb && pool) {
      try {
        const insertQuery = `
          INSERT INTO registrations (
            registration_id, full_name, email, phone, institution, reg_number,
            department, year_or_role, track, attendance_mode, experience_level,
            license_assistance, project_interest
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *;
        `;
        const values = [
          data.registration_id,
          data.full_name,
          data.email,
          data.phone || '',
          data.institution,
          data.reg_number || '',
          data.department,
          data.year_or_role,
          data.track,
          data.attendance_mode || 'in_person',
          data.experience_level || 'Beginner',
          data.license_assistance ?? true,
          data.project_interest || ''
        ];

        const res = await pool.query(insertQuery, values);

        // Deduct seats if in-person
        if (data.attendance_mode === 'in_person') {
          await pool.query(`
            UPDATE workshops
            SET booked_lab_seats = booked_lab_seats + 1,
                solidworks_seats_left = CASE WHEN $1 IN ('solidworks', 'both_mechatronics') AND solidworks_seats_left > 0 THEN solidworks_seats_left - 1 ELSE solidworks_seats_left END,
                altium_seats_left = CASE WHEN $1 IN ('altium', 'both_mechatronics') AND altium_seats_left > 0 THEN altium_seats_left - 1 ELSE altium_seats_left END
            WHERE slug = 'workshopreg2';
          `, [data.track]);
        }

        return res.rows[0];
      } catch (err) {
        console.error('[DB Insert Error]:', err.message);
        throw err;
      }
    }

    // In-memory fallback
    const newReg = {
      id: inMemoryStore.registrations.length + 1,
      ...data,
      created_at: new Date().toISOString()
    };
    inMemoryStore.registrations.unshift(newReg);

    if (data.attendance_mode === 'in_person') {
      inMemoryStore.workshop.booked_lab_seats += 1;
      if ((data.track === 'solidworks' || data.track === 'both_mechatronics') && inMemoryStore.workshop.solidworks_seats_left > 0) {
        inMemoryStore.workshop.solidworks_seats_left -= 1;
      }
      if ((data.track === 'altium' || data.track === 'both_mechatronics') && inMemoryStore.workshop.altium_seats_left > 0) {
        inMemoryStore.workshop.altium_seats_left -= 1;
      }
    }

    return newReg;
  },

  async findByRegistrationId(regId) {
    if (isConnectedToDb && pool) {
      try {
        const res = await pool.query('SELECT * FROM registrations WHERE registration_id = $1 LIMIT 1', [regId]);
        return res.rows[0] || null;
      } catch (err) {
        console.error('[DB Query Error - findByRegistrationId]:', err.message);
      }
    }
    return inMemoryStore.registrations.find(r => r.registration_id === regId) || null;
  }
};
