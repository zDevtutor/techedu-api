const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Router files
const categories = require("./routes/categories");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/categories", categories);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode and PORT ${PORT}`
  );
});
