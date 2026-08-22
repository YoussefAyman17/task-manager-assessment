const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use("api/auth", authRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
