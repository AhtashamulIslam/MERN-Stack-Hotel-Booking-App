import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import { errorHandler } from '../utils/error.js';
import User from '../models/User.js'
import Hotel from '../models/Hotel.js';

// Check availability function 
const checkAvailability = async({roomId,checkInDate,checkOutDate})=>{
       const bookings = await Booking.find({
              roomId,
              checkInDate: { $lte : checkOutDate},
              checkOutDate : { $gte : checkInDate} 
             })
             const isAvailable = bookings.length === 0;
             return isAvailable;
}
// Check availability API 

export const checkAvailabilityAPI = async(req,res,next)=>{

      const {checkInDate,checkOutDate} = req.body;
      const room = await Room.findById(req.params.roomId)
      if(!room){
        return next(errorHandler(403,'Room not found'))
      }
      try {
             const {_id}=room
             const roomId = _id
             const isAvailable = await checkAvailability({roomId,checkInDate,checkOutDate})
            await res.json(isAvailable)
      } catch (error) {
          next(error)
      }
       
}

// API to create a new booking 

export const createBooking = async (req,res,next)=>{
    
      if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not an authenticated user'))
      }
      const hotel = await Hotel.findById(req.params.hotelId)
      if(!hotel){
        return next(errorHandler(403,'Hotel not found'))
      }
       const room = await Room.findById(req.params.roomId)
      if(!room){
        return next(errorHandler(403,'Room not found'))
      }
      const user = await User.findById(req.params.userId)
      const {checkInDate,checkOutDate,guests} = req.body
      const roomId = room._id
      try {
             const isAvailable = await checkAvailability({roomId,checkInDate,checkOutDate})
             if(!isAvailable){
                return next(errorHandler(400,'This room is not available now'))
             }
             const roomData = await Room.findById(roomId).populate('hotel')
             const totalPrice = roomData.pricePerNight

             const checkIn = new Date(checkInDate)
             const checkOut = new Date(checkOutDate)
             const timeDiff = checkOut.getTime() - checkIn.getTime()
             const nights = Math.ceil(timeDiff / (1000*3600*24))

             totalPrice *= nights

             const booking = await Booking.create({
                  userId:user._id,
                  hotelId:hotel._id,
                  roomId,
                  guests: +guests,
                  checkInDate,
                  checkOutDate,
                  totalPrice
             })
         await booking.save();
         res.status(200).json("Room is booked successfully")
      } catch (error) {
           next(error) 
      }
}

//API to get all bookings of a particular user.

export const getUserBooking = async (req,res)=>{

       if(req.user.id !== req.params.userId){
            return next(errorHandler(400,'You are not allowed to get user booking data'))
       }
       try {
             const userId = req.params.userId
             const bookings = await Booking.find({userId}).sort({createdAt: -1})
             res.status(200).json({
                  bookings
             })
       } catch (error) {
           next(error) 
       }
}

export const getHotelBookings = async (req,res)=>{
       
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403,'You are not allowed to get hotel booking data'))
        }
        if(!req.user.isHotelOwner){
            return next(errorHandler(403,'You are not allowed to get hotel booking data'))
        }
       
          const hotel = await Hotel.findById(req.params.hotelId)
          if(!hotel){
            return next(errorHandler(403,'Hotel not found'))
          }
          
        try {
             const hotelId = req.params.hotelId
             const hotelBookings = await Booking.find({hotelId}).sort({ createdAt: -1 })
             const totalBooking = hotelBookings.length
             const totalRevenue = hotelBookings.reduce((acc,booking)=>acc + booking.totalPrice,0)
             res.status(200).json({
                  hotelBookings,
                  totalBooking,
                  totalRevenue
             })
        } catch (error) {
            next(error)
        }
}






