import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { errorHandler } from "../utils/error.js";

export const registerHotel = async (req,res,next)=>{
    
      if(req.user.id !== req.params.userId){
         return next(errorHandler(403,'You are not allowed to register hotel'))
      }
        const {name,contact,address,city} = req.body;
      
        if(!name || !address || !contact || !city || name === '' || address === '' || contact === '' || city === ''){
          return next(errorHandler(400,"Please provide all required fields"))
       }
       const userId = req.params.userId;
       const hotel = await Hotel.find({userId})
       if(hotel.length > 0){
          return next(errorHandler(400,'You already registered a hotel'))
       }
       const newHotel = new Hotel({
             userId:req.user.id,
             name,
             address,
             contact,
             city
        })
    
      try {
        
        await newHotel.save()
        res.json('Hotel registration successful')

      } catch (error) {
          next(error)
      }
}

export const updateUserRole = async (req,res,next)=>{
  
     if(req.user.id !== req.params.userId){
        return next(errorHandler(403,'You are not allowed to register hotel'))
      }
       try {
            await User.findByIdAndUpdate(req.params.userId,
              { $set:{
                       username:req.body.username,
                       email:req.body.email,
                       profilePicture:req.body.profilePicture,
                       password:req.body.password,
                       recentSearchedCities:req.body.recentSearchedCities,
                       isUser:true,
                       isHotelOwner:true}},
               { new:true })
            res.json("User role has been updated")
       } catch (error) {
          next(error)
       }
      
}

export const getHotel = async (req,res,next)=>{

    try {
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403,'You are not allowed to get hotel details'))
        }
        const userId = req.params.userId;
        const hotel = await Hotel.findOne({userId})
        if(!hotel){
            return next(errorHandler(404,'Hotel not found'))
        }
        res.status(200).json(hotel)
    } catch (error) {
        next(error)
    }
}