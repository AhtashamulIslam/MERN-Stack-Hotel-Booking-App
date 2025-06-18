import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
      
      hotelId:{
         type:String,
         required:true
      },
      userId:{
         type:String,
         required:true
      },
      roomType:{
         type:String,
         required:true
      },
      pricePerNight:{
         type:Number,
         required:true
      },
      amenities:{
         type:Array,
         required:true
      },
      images:[{
           type:Array
      }],
      isAvailable:{
        type:Boolean,
        default:true
      }
      
}, { timestamps:true })

const Room = mongoose.model('Room',roomSchema)

export default Room;