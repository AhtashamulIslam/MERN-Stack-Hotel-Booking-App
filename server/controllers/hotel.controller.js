import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { errorHandler } from "../utils/error.js";

export const registerHotel = async (req,res,next)=>{
    
       if(req.user.id !== req.params.userId){
         return(errorHandler(403,'You are not allowed to register hotel'))
      }

       if(!req.body.name || !req.body.address || !req.body.contact || !req.body.city){
          return next(errorHandler(400,"Please provide all required fields"))
       }

       const hotel = new Hotel({
             ...req.body, userId:req.user.id
        })
    
      try {
        
        await hotel.save()
        await User.findByIdAndUpdate(req.params.userId,{ $set:{isHotelOwner:true}})
        res.json('Hotel registration successful')

      } catch (error) {
          next(error)
      }
}