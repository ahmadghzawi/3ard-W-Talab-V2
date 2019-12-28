require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", error => console.err(error));
db.once("open", () => console.log(`Connected to 3ard W Talab database`));

module.exports = db;