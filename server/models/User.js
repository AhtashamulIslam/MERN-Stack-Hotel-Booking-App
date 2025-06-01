import mongoose from "mongoose";

// As we use clerk authentication system, we don't need to store user data in the database manually.
// Instead, we will use the user ID from Clerk to identify users in our application.
// This schema is used to store user data in the database, but we will not use it for authentication.
// We will use Clerk's user ID to identify users in our application.
const userSchema = new mongoose.Schema({    
   
     _id:{
        type: String,
        required: true,
     },
     username: {
        type: String,
        required: true,
     },
     email: {
        type: String,
        required: true,
     },
     image: {
        type: String,
        required: true,
     },
     role:{
        type: String,
        enum: ['user', 'hotelOwner'],
        default: 'user',
     },
     recentSearchedCities:[{
        type: String,
        required: true,
     }]

},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;