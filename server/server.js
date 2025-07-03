import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB  from './configs/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import hotelRoutes from './routes/hotel.route.js'
import roomRoutes from './routes/room.route.js'
import connectCloudinary from './configs/cloudinary.js';
import bookingRoutes from './routes/booking.route.js'


connectDB(); // Connect to the database.
connectCloudinary();

const app = express();  
app.use(cors())
//Middleware to use express JSON to convert it as json and Clerk authentication.
app.use(express.json()); // Parse incoming JSON requests.
app.use(cookieParser());

// API to listen to clerkWebhook to manage USER.


app.get('/', (req, res) => {
  res.send('API is working fine'); // Respond with a simple message.
})

const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000.   

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the server start message.
})

// We will put the routes of our applicatiuon here.

app.use('/api/auth' , authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/hotel',hotelRoutes);
app.use('/api/room',roomRoutes);
app.use('/api/booking',bookingRoutes);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})