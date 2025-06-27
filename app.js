require("dotenv").config();
const express = require("express");
const app = express();
const connectdb = require("./db/connectdb");
const habits = require("./routes/habit");
const cors = require("cors");
const authRoutes = require("./routes/auth");

//middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://habits.sahilrao.cc", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//routee added
app.use("/habits", habits); // ⬅ base path for habit routes
app.use("/auth", authRoutes); // ⬅ base path for auth routes

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectdb();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

start();
