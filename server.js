const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const shopRoutes = require('./routes/shopRoutes')

dotenv.config();
const app = express();



// Middleware
app.use(bodyParser.json());
app.use(shopRoutes);

//Database connection
const connect = mongoose.connect(process.env.MONGO_URI)
connect.then(() => {
    console.log("Database Connected");
}) .catch((err) => {
    console.log(err.message);
})

// Starting the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server running on ${PORT}`);
})