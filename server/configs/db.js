import mongoose from "mongoose";

const connectDB = async () => { 
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to Database successfully");
    }
    )
     await mongoose.connect(`${process.env.MONGODB_URI}/mern-hotel-booking-system`);
   
  } catch (error) {
    console.log(error.message);
  }
}   

export default connectDB;