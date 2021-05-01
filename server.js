const path = require("path");
const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Router files
const categories = require("./routes/categories");
const projects = require("./routes/projects");
const auth = require("./routes/auth");

const app = express();

// Body parser
app.use(express.json());

// File upload
app.use(fileupload());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/categories", categories);
app.use("/api/v1/projects", projects);
app.use("/api/v1/auth", auth);

// Custom Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode and PORT ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Stop server & exist process
  server.close(() => process.exit(1));
});
