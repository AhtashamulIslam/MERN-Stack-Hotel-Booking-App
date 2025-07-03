import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/User.js'

export const getUser = async (req,res,next)=>{
   
      if(req.user.id !== req.params.userId){
         return(errorHandler(403,'You are not allowed to get user data'))
      }
     try {
       const user = await User.findById(req.params.userId);
       if(!user){
          return next(errorHandler(403,'user not found'))
       }
       
       res.json(user);
     } catch (error) {
        next(error)
     }
    
}
export const signOut=async (req,res,next)=>{
    try {
        res.clearCookie('access_token')
           .status(200)
           .json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req,res,next)=>{
    //We get a user ID from Cookie cause we set the Cookie only by ID.
     //For valid user the ID from Cookie is equal to the user ID.
     //That means the person is authenticated.
     //checking the Id from cookie with params userId
     if(req.user.id!==req.params.userId){//from api> api/user/update/:userId->params
        return next(errorHandler(403,'You are not allowed to update this user'))
     }
     //Handling the Username Validity
     if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
          return next(
            errorHandler(400, 'Username must be between 7 and 20 characters')
          );
        }
        if (req.body.username.includes(' ')) {
          return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
          return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
          return next(
            errorHandler(400, 'Username can only contain letters and numbers')
          );
        }
    }
     //Handling Password validity
     if (req.body.password) {
        if (req.body.password.length < 6) {
          return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
      
    try {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                //We are allowed the fields to be updated.
              $set:{
                     username:req.body.username,
                     email:req.body.email,
                     profilePicture:req.body.profilePicture,
                     password:req.body.password
              },
              
            },
            { new:true } // It will give the permission to update the values.
        )
        const {password,...rest}=updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}

export const deleteUser=async (req,res,next)=>{
  //Check the user Id from Cookie whether it is the owner or not
  // if the user is admin then it will proceed the try block to delete. 
   if(!req.user.isHotelOwner && req.user.id !== req.params.userId){
      return next(errorHandler(400,'You are not allowed to delete this user'))
   }
   try {
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json('User has been deleted')

   } catch (error) {
      next(error)
   }
}

// Store the user's recent searched cities. 

export const storeRecentSearchedCities = async (req,res,next)=>{
   
      if(req.user.id !== req.params.userId){
          return next(errorHandler(403,'You are not allowed to store recent searched cities'))
      }
     try {
              const {recentSearchedCity} = req.body
              const user = await User.findById(req.user.id)
              if(!user){
                return next(errorHandler(404,'User not found'))
              }

            if(user.recentSearchedCities.length < 3 ) {
                user.recentSearchedCities.push(recentSearchedCity)
            }else{
              user.recentSearchedCities.shift()
              user.recentSearchedCities.push(recentSearchedCity)
            }

            await user.save()
            res.json({success:true, message:"City added"})
          
      } catch (error) {
            res.json({success:false, message:error.message})
      }
}