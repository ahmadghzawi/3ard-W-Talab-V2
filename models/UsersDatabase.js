const usersSchema = new mongoose.Schema({
  username: String,
  password: { type: String, required: true },
  name: String,
  email: String,
  phoneNumber: Number
});

module.exports = mongoose.model("users", usersSchema);
