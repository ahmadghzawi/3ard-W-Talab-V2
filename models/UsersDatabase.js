require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", err => console.err(err));
db.once("open", () => console.log(`Connected to users database`));

const usersSchema = new mongoose.Schema({
  username: String,
  password: { type: String, required: true },
  name: String,
  email: String,
  phoneNumber: Number
});

module.exports = mongoose.model("users", usersSchema);
