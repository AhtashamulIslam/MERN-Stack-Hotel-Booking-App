import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import { errorHandler } from '../utils/error.js';
import User from '../models/User.js'
import Hotel from '../models/Hotel.js';
import transporter from '../configs/nodemailer.js';

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
      const roomId = req.params.roomId
      try {
             const isAvailable = await checkAvailability({roomId,checkInDate,checkOutDate})
             if(!isAvailable){
                return next(errorHandler(400,'This room is not available now'))
             }
             const pricePerNight = room.pricePerNight

             const checkIn = new Date(checkInDate)
             const checkOut = new Date(checkOutDate)
             const timeDiff = checkOut.getTime() - checkIn.getTime()
             const nights = Math.ceil(timeDiff / (1000*3600*24))

            const totalPrice = nights* pricePerNight;

             const booking = await Booking.create({
                  userId:user._id,
                  hotelId:hotel._id,
                  hotelName:hotel.name,
                  hotelAddress:hotel.address,
                  roomId,
                  roomImages:room.images,
                  roomType:room.roomType,
                  guests: +guests,
                  checkInDate,
                  checkOutDate,
                  totalPrice
             })
         await booking.save();

         const mailOptions = {
       
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Hotel Booking Confirmation",
            html:`
                  <h2> Your Booking Details </h2>
                  <p> Dear ${user.username},</p>
                  <p>Thank you for your booking! Here are your details:</p>
                  <ul>
                    <li><strong>Booking ID :</strong> ${booking._id}</li>
                    <li><strong>Hotel Name :</strong> ${booking.hotelName}</li>
                    <li><strong>Location :</strong> ${booking.hotelAddress}</li>
                    <li><strong>Date :</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount :</strong> $ ${room.pricePerNight} /night</li>
                  </ul>
               <p>We look forward to welcoming you!</p>
              <p>If yoy need to make any changes, feel free to contact us.</p>
            `, // HTML body
         }
         await transporter.sendMail(mailOptions)
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
             res.status(200).json(
                  bookings
             )
       } catch (error) {
           next(error) 
       }
}

export const getHotelBookings = async (req,res,next)=>{
       
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403,'You are not allowed to get hotel booking data'))
        }
       
          const hotel = await Hotel.findOne({userId:req.params.userId})
          if(!hotel._id){
            return next(errorHandler(403,'Hotel not found'))
          }
          
        try {
             const hotelId = hotel._id
             const bookings = await Booking.find({hotelId}).sort({ createdAt: -1 })
             const totalBooking = bookings.length
             const totalRevenue = bookings.reduce((acc,booking)=>acc + booking.totalPrice,0)
             res.status(200).json({
                  bookings,
                  totalBooking,
                  totalRevenue
             })
        } catch (error) {
            next(error)
        }
}






