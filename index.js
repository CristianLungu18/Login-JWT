require("dotenv").config();
const connectDB = require("./config/database");
const express = require("express");
const authRoutes = require("./routes/auth");
const path = require("path");
const notFoundMiddleware = require("./middleware/not-found");
const userModel = require("./models/user");
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//ROUTES

app.use(authRoutes);
app.use(notFoundMiddleware);

//VIEW ENGINE
app.set("view engine", "ejs");

const startApp = async () => {
  await connectDB("mongodb://localhost/LoginJWT");
  console.log("Database connected!");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT: ${process.env.PORT}`);
  });
};

startApp();
