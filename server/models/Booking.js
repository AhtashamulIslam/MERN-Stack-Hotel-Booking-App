import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
      
       hotelId:{
           type:String,
           required:true
       },
       roomId:{
           type:String,
           required:true
       },
       userId:{
        type:String,
        required:true
       },
        hotelName:{
              type: String,
              required: true
       },
        hotelAddress:{
              type: String,
              required: true
       },
       roomType:{
         type:String,
         required:true
      },
       roomImages:[{
           type:Array
      }],
      checkInDate:{
           type:Date,
           required:true
      },
      checkOutDate:{
          type:Date,
          required:true
      },
      totalPrice:{
          type:Number,
          required:true
      },
      guests:{
          type:Number,
          required:true
      },
      status:{
          type:String,
          enum:["pending","confirmed","cancelled"],
          default:"pending"
      },
      paymentMethod:{
         type:String,
         required:true,
         default:"Pay At Hotel"
      },
      isPaid:{
          type:Boolean,
          default:false
      }
},{
    timestamps:true
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking;