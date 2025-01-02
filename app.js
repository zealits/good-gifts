// app.js
const express = require("express");
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Import the routes for the API
const restaurantAdminRoutes = require("./routes/restaurantAdminRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");
 
// Make sure to add your dashboard routes here

// Create an Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes

app.use("/api/v1/admin", restaurantAdminRoutes);  // Your restaurant admin API routes
app.use("/api/v1/admin", giftCardRoutes);         // Your gift card API routes
      

// Serve React app (if you're serving a frontend from the backend)
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"));
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
