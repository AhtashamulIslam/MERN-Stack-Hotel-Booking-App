import express from "express";
import {createRoom, getHotelRooms,getRoom, getRooms,getHotelRoomsByCity, toggleRoomAvailablity} from "../controllers/room.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from '../utils/imageUpload.js'
const router = express.Router()

router.post('/create-room/:userId/:hotelId', upload.array("images",4),verifyToken,createRoom)
router.get('/get-rooms/:userId',verifyToken,getHotelRooms)
router.post('/toggle-room-availability/:roomId',toggleRoomAvailablity)
router.get('/get-rooms',getRooms)
router.get('/get-room/:roomId',getRoom)
router.get('/hotel-rooms/:city',getHotelRoomsByCity)
export default router;