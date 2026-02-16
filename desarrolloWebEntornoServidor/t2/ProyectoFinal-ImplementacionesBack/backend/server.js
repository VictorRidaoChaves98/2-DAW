require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`FitFood API running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
