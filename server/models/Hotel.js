import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({

       userId:{
              type: String,
              required: true
       },
       name:{
              type: String,
              required: true
       },
        address:{
              type: String,
              required: true
       },
        contact:{
              type: String,
              required: true
       },
        city:{
              type: String,
              required: true
       },
      
}, { timestamps:true })

const Hotel = mongoose.model('Hotel',hotelSchema)

export default Hotel;