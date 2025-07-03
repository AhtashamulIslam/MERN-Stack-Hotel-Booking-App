import Room from "../models/Room.js";
import { errorHandler } from "../utils/error.js";
import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary'

export const createRoom = async(req,res,next)=>{
   
      if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not allowed to add room for a hotel'))
      }

      const hotel = await Hotel.findById(req.params.hotelId)
      if(!hotel._id){
         return next(errorHandler(403,'Hotel not found'))
      }

      const {roomType,pricePerNight,amenities} = req.body

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
        
         const images = await Promise.all(uploadImages)
         const room = await Room.create({
               hotelId:req.params.hotelId,
               userId:req.params.userId,
               hotelName:hotel.name,
               hotelAddress:hotel.address,
               roomType,
               pricePerNight: +pricePerNight, // To convert the string to number
               amenities:JSON.parse(amenities),
               images
            })
      
             await room.save()
             res.status(200).json('Room created successfully')
          
      } catch (error) {
          next(error)
      }
}

// API to get all rooms.
export const getRooms = async(req,res,next)=>{
   
     try {
          const rooms = await Room.find({
              _id:{$ne:null} // This is to ensure we get all rooms except those with null IDs.
           }).sort({createdAt : -1})
       await res.status(200).json(rooms)
     } catch (error) {
        next(error)
     }
}

// API to get hotel rooms of a specific city.
export const getHotelRoomsByCity = async(req,res,next)=>{
   
   try {
      const hotel = await Hotel.find({city:req.params.city})
      if(!hotel.length){
         return next(errorHandler(404,'No hotels found in this city'))
      }
      const rooms = await Room.find({hotelId:{$in:hotel.map(h=>h._id)}}).sort({createdAt : -1})
      await res.status(200).json(rooms)
   } catch (error) {
      next(error)
   }
}

// API to get all rooms of a specific hotel. 
export const getHotelRooms = async(req,res,next)=>{
    
    if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not allowed to explore the available rooms'))
      }
      
      try {
        const rooms = await Room.find({userId:req.params.userId}).sort({createdAt : -1})
        await res.status(200).json(rooms)
     } catch (error) {
        next(error)
     }
}

// API to get a specific room.
export const getRoom = async(req,res,next)=>{
      try {
         const room = await Room.findById(req.params.roomId)
         if(!room){
               return next(errorHandler(404,'Room not found'))
         }
         await res.status(200).json(room)
      } catch (error) {
         next(error)
      }
   }
// API to toggle availability of a room.

export const toggleRoomAvailablity = async (req,res,next)=>{
  
      
     try {
           const roomData = await Room.findById(req.params.roomId)
             if(!roomData){
               return next(errorHandler(404,'Room not found'))
             }
           await Room.findByIdAndUpdate(req.params.roomId,
               { $set:{isAvailable:!roomData.isAvailable}},{new:true})  
           await res.status(200).json('Room availability updated')
     } catch (error) {
        next(error)
     }
}



