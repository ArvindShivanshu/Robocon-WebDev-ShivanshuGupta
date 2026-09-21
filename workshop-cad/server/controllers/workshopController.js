import { db } from '../config/db.js';

const DELIVERABLES = [
  'Accredited Certificate of Participation & Technical Completion',
  '60-Day Educational Software License Assistance (SolidWorks 2024 & Altium 24)',
  'Hands-on Lab Hardware Kit with Custom Multilayer PCB & Milled Aluminum Enclosure',
  'Access to GitHub Repository with Certified DRC Rules & Parametric 3D Templates',
  '1-on-1 Design Review with Mechatronics Lead Mentors'
];

const FACULTY = [
  {
    name: 'Dr. Aris Thorne',
    title: 'Lead MCAD Architect',
    organization: 'Mechatronics Systems Research Lab',
    expertise: 'SolidWorks Certified Professional, FEA & Injection Mold Tooling Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tags: ['SolidWorks 2024', 'Topology Optimization', 'DFM Tooling']
  },
  {
    name: 'Vivian Chen',
    title: 'Senior Signal Integrity Specialist',
    organization: 'NextGen Silicon & ECAD Center',
    expertise: 'Altium Elite Specialist, 56Gbps PAM4 SerDes & Controlled Impedance Stackups',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tags: ['Altium 24', 'High-Speed SerDes', 'Rigid-Flex PCB']
  },
  {
    name: 'Kaelen Vance',
    title: 'Director of Hardware Engineering',
    organization: 'Autonomous Aerospace Group',
    expertise: 'Pioneer of Bi-Directional IDX 3.0 MCAD-ECAD Synchronization across flight hardware',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tags: ['MCAD-ECAD Sync', 'Thermal Modeling', 'Robotic Enclosures']
  }
];

export async function getWorkshopStats(req, res) {
  try {
    const workshop = await db.getWorkshop();
    const isSupabase = db.isSupabaseConnected();

    res.json({
      success: true,
      data: {
        workshop,
        faculty: FACULTY,
        deliverables: DELIVERABLES,
        admission_status: 'Open Registration (No Tuition Fee)',
        database_status: isSupabase ? 'connected_to_supabase' : 'resilient_mode'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function registerAttendee(req, res) {
  try {
    const {
      fullName,
      email,
      phone,
      institution,
      regNumber,
      department,
      yearOrRole,
      track,
      attendanceMode,
      experienceLevel,
      licenseAssistance,
      projectInterest
    } = req.body;

    if (!fullName || !email || !institution || !department || !yearOrRole || !track) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Email, Institution, Department, Year/Role, Track).'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid institutional or email address.'
      });
    }

    // Generate clean delegate registration ID
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    const trackPrefix = track === 'solidworks' ? 'SW3D' : track === 'altium' ? 'ALTI' : 'MCAD';
    const regId = `REG-${trackPrefix}-${randomHex}`;

    const registrationData = {
      registration_id: regId,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      institution: institution.trim(),
      reg_number: regNumber ? regNumber.trim() : '',
      department: department.trim(),
      year_or_role: yearOrRole.trim(),
      track: track,
      attendance_mode: attendanceMode || 'in_person',
      experience_level: experienceLevel || 'Beginner',
      license_assistance: licenseAssistance ?? true,
      project_interest: projectInterest ? projectInterest.trim() : ''
    };

    const created = await db.createRegistration(registrationData);
    const updatedWorkshop = await db.getWorkshop();

    res.status(201).json({
      success: true,
      message: 'Workshop registration confirmed successfully!',
      data: {
        registration: created,
        updatedSeats: {
          total: updatedWorkshop.total_lab_seats,
          booked: updatedWorkshop.booked_lab_seats,
          solidworks_left: updatedWorkshop.solidworks_seats_left,
          altium_left: updatedWorkshop.altium_seats_left
        }
      }
    });
  } catch (err) {
    console.error('Registration processing error:', err);
    res.status(500).json({ success: false, message: 'Failed to process registration: ' + err.message });
  }
}

export async function getRegistration(req, res) {
  try {
    const { regId } = req.params;
    const registration = await db.findByRegistrationId(regId);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function listRegistrations(req, res) {
  try {
    const registrations = await db.getRegistrations();
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
