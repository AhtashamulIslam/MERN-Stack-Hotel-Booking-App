import express from "express";
import { getHotel, registerHotel, updateUserRole } from "../controllers/hotel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router()

router.post('/:userId',verifyToken,registerHotel)
router.get('/get-hotel/:userId',verifyToken,getHotel) // Assuming you want to get hotel details by userId
router.put('/update-user-role/:userId',verifyToken,updateUserRole)

export default router;