import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();  
app.use(cors())
//Middleware to use express JSON to convert it as json and Clerk authentication.
app.use(express.json()); // Parse incoming JSON requests.

// API to listen to clerkWebhook to manage USER.


app.get('/', (req, res) => {
  res.send('API is working fine'); // Respond with a simple message.
})

const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000.   

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the server start message.
})
