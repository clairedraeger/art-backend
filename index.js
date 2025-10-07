const express = require("express");
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 4000;

// CORS set up
const allowedOrigins = [
  'http://localhost:3000',
  'https://art-project-claire.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

const cloudinaryRoutes = require('./routes/cloudinary');
app.use('/image/upload', cloudinaryRoutes)

const cloudinaryUrlRoutes = require('./routes/cloudinaryurl');
app.use('/url', cloudinaryUrlRoutes)

const midjourneyRoutes = require('./routes/midjourney');
app.use('/api', midjourneyRoutes)

const blendSublimeRoute = require('./routes/replicate');
app.use('/api', blendSublimeRoute);

const imageHostingRoutes = require('./routes/imagehosting');
app.use('/imagehost', imageHostingRoutes)

app.get("/", (request, response)=> {
    response.status(200).json({ message: "Hello! Server is running"});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
