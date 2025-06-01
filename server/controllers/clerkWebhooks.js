import User from "../models/User.js";
import { Webhook } from "svix"; // We use to get the User data from Clerk webhook.

// When we create cler authentication,it automatically creates a security layer in our profile. 

const clerkWebhooks = async (req,res)=>{
    
      try {
        // Create a Svix instance with clerk webhook secret key. 
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Getting headers 
        const headers = {
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        }
        // Verifying Headers
        await whook.verify(JSON.stringify(req.body),headers)

        // Getting data and event type from request body. 
        const {data,type} = req.body
        // Setting our userData from data to store in DB.
        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name+" "+data.last_name,
            image:data.image_url,
        }

       // Now based on the event we initiate a switch case block to execute the DB operation.
        switch (type) {
            case 'user.created':{
                await User.create(userData) // We pass the user data from clerk. 
                break
            }

             case 'user.updated':{
                await User.findByIdAndUpdate(data.id,userData)
                break
            }

             case 'user.deleted':{
                await User.findByIdAndDelete(data.id)  
                break
            }
                 
            default:
                break;
        }

        res.json({
             success:true,
             message:"Webhook Received"
        })
      } catch (error) {
        
         console.log(error.message)
         res.json({
            success:false,
            message:error.message
         })
      }
}

export default clerkWebhooks;