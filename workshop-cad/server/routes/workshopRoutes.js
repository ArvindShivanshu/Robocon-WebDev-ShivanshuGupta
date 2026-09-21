import express from 'express';
import {
  getWorkshopStats,
  registerAttendee,
  getRegistration,
  listRegistrations
} from '../controllers/workshopController.js';

const router = express.Router();

// GET workshop overview, lab availability, faculty, and deliverables
router.get('/info', getWorkshopStats);

// POST new workshop registration
router.post('/register', registerAttendee);

// GET attendee registration details by registration ID
router.get('/registrations/:regId', getRegistration);

// GET registered delegates
router.get('/attendees', listRegistrations);

export default router;
