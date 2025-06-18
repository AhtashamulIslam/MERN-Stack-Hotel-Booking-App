import express from "express";
import {createRoom, getHotelRooms, getRooms, toggleRoomAvailablity} from "../controllers/room.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from '../utils/imageUpload.js'
const router = express.Router()

router.post('/create-room/:userId', upload.array('images',4),verifyToken,createRoom)
router.get('/',getRooms)
router.get('/owner',verifyToken,getHotelRooms)
router.get('/toggler-room-availability/:roomId',verifyToken,toggleRoomAvailablity)
export default router;