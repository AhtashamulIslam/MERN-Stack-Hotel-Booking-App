import express from "express";
import { registerHotel } from "../controllers/hotel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router()

router.post('/:userId',verifyToken,registerHotel)

export default router;