const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AccidentProneArea = require('./models/AccidentProneArea'); // Import the model
const Case = require('./models/Case');
const User = require('./models/User');
const cors = require("cors");
const axios = require('axios'); // Import axios for HTTP requests
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
dotenv.config(); 

const app = express();
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5173', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const JWT_SECRET = 'your_jwt_secret_key';
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY; // Use environment variable for API key

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

app.post('/accident-prone-areas', async (req, res) => {
  try {
    const { name, description, latitude, longitude, severityLevel } = req.body;

    const newArea = new AccidentProneArea({
      name,
      description,
      latitude,
      longitude,
      severityLevel,
    });

    const savedArea = await newArea.save();
    res.status(201).json(savedArea);
  } catch (error) {
    res.status(500).json({ message: 'Error saving area', error });
  }
});

app.get('/accident-prone-areas', async (req, res) => {
  try {
    const areas = await AccidentProneArea.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching areas', error });
  }
});

app.post('/case', async (req, res) => {
  try {
    const { PatientName, VehicleNumber, AccidentReporterName, latitude, longitude, severityLevel } = req.body;
    const newCase = new Case({
      PatientName,
      VehicleNumber,
      AccidentReporterName,
      latitude,
      longitude,
      severityLevel
    });

    const savedCase = await newCase.save();

    res.status(201).json(savedCase);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.get('/compute-routes', async (req, res) => {
  const originLat = req.query.originLat || 37.7749;
  const originLng = req.query.originLng || -122.4194;
  const destinationLat = req.query.destinationLat || 34.0522;
  const destinationLng = req.query.destinationLng || -118.2437;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${originLat},${originLng}`,
        destination: `${destinationLat},${destinationLng}`,
        key: apiKey
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/user',async (req,res)=>{
  try{
    const {BranchName,Details,Password,latitude,longitude,organizationType} = req.body;
    const newUser = new User({
      BranchName,
      Details,
      Password,
      latitude,
      longitude,
      organizationType
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
})

app.post('/login', async(req, res) => {
  const { username, Password } = req.body;

  // Check if the user exists
  const user = await User.findOne({BranchName: username , Password});
  if (!user ) {
      return res.status(400).json({ message: 'Invalid username or department' });
  }

  

  // Create a JWT token
  const token = jwt.sign({ username: user.BranchName, latitude: user.latitude, longitude : user.longitude }, JWT_SECRET, { expiresIn: '1h' });

  // Send token as both cookie and JSON response
  res.cookie('token', token, {
      httpOnly: true, // Prevent access to the token via JavaScript
      secure: false,  // Set true if you're using HTTPS
      sameSite: false, // Protect against CSRF
      maxAge: 3600000 // 1 hour in milliseconds
  });

  res.json({
      message: 'Login successful',
      token, 
      longitude: user.longitude,
      BranchName: user.BranchName,
      latitude: user.latitude,
      organizationType: user.organizationType
  });
});
// Middleware to verify JWT token and extract data
// Middleware to verify JWT token and extract data
const verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token']; // Extract token from a custom header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Save decoded token data to the request object
    req.user = decoded;
    next();
  });
};

// API endpoint to extract latitude and longitude from the token
app.get('/extract-coordinates', verifyToken, (req, res) => {
  const { latitude, longitude } = req.user; // Extract latitude and longitude from the decoded token

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Coordinates not found in token' });
  }

  res.json({
    latitude,
    longitude,
    message: 'Coordinates extracted successfully'
  });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
