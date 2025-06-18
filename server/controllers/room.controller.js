import Room from "../models/Room.js";
import { errorHandler } from "../utils/error.js";
import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary'

export const createRoom = async(req,res)=>{
   
      if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not allowed to add room for a hotel'))
      }

      if(!req.user.isAdmin){
         return next(errorHandler(403,'You are not allowed to add room for a hotel'))
      }

      const hotel = await Hotel.findOneById(req.params.userId)
      if(!hotel){
         return next(errorHandler(403,'Hotel not found'))
      }

      const {roomType,pricePerNight,amenities,images} = req.body

      if(!roomType || !pricePerNight || !amenities){
         return next(errorHandler(400,'All fields are required'))
      }

     
      try {

             // Upload images to cloudinary
         const uploadImages = req.files.map(async (file)=>{
         const response = await cloudinary.uploader.upload(file.path)
         // In this response we will get secure URL of image uploaded in cloudinary.
         return response.secure_url;
      })
        
         const imagesCloudinary = await Promise.all(uploadImages)
         const room = new Room.create({
               hotelId:hotel._id,
               userId:req.params.userId,
               roomType,
               pricePerNight: +pricePerNight, // To convert the string to number
               amenities:JSON.parse(amenities),
               images:imagesCloudinary,
            })
      
             await room.save()
             res.json('created successfully')
          
      } catch (error) {
          next(error)
      }
}

// API to get all rooms.
export const getRooms = async()=>{
   
     try {
          const rooms = await Room.find({
              isAvailable:true
           }).populate({
            path:'hotel',
            populate:{
               path:'owner',
               select:'image'
            }
           }).sort({createdAt : -1})
           await res.json(rooms)
     } catch (error) {
        next(error)
     }
}

// API to get all rooms of a specific hotel. 
export const getHotelRooms = async()=>{
    
    if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not allowed to explore the available rooms'))
      }

      if(!req.user.isAdmin){
         return next(errorHandler(403,'You are not allowed to explore the available rooms'))
      }
     try {
        const hotel = await Hotel.findOneById(req.params.userId)
        const rooms = await Room.find({hotelId:hotel._id.toString()}).populate('hotel')
        await res.json(rooms)
     } catch (error) {
        next(error)
     }
}

// API to toggle availability of a room.

export const toggleRoomAvailablity = async (req,res,next)=>{
  
     try {
           const roomData = await Room.findById(req.params.roomId)
           roomData.isAvailable = !roomData.isAvailable
           await res.json('Room availability updated')
     } catch (error) {
        next(error)
     }
}



