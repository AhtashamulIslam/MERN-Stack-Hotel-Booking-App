import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { checkAvailabilityAPI, createBooking, getHotelBookings,getUserBooking } from '../controllers/booking.controller.js'

const router = express.Router();

router.post('/check-availability/:roomId',checkAvailabilityAPI);
router.post('/create-booking/:userId/:hotelId/:roomId',verifyToken,createBooking);
router.get('/user-bookings/:userId',verifyToken,getUserBooking);
router.get('/hotelowner-bookings/:userId',verifyToken,getHotelBookings);

export default router;
