const express = require("express");
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const cloudinaryRoutes = require('./routes/cloudinary');
app.use('/image/upload', cloudinaryRoutes)

const cloudinaryUrlRoutes = require('./routes/cloudinaryurl');
app.use('/url', cloudinaryUrlRoutes)

const midjourneyRoutes = require('./routes/midjourney');
app.use('/api', midjourneyRoutes)

app.get("/", (request, response)=> {
    response.status(200).json({ message: "Hello! Server is running"});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))