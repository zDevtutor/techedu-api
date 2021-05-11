const path = require("path");
const express = require("express");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
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
const reviews = require("./routes/reviews");
const auth = require("./routes/auth");
const users = require("./routes/users");
const profiles = require("./routes/profiles");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Create security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Prevent http param pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/categories", categories);
app.use("/api/v1/projects", projects);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/users", users);
app.use("/api/v1/auth/profiles", profiles);

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
