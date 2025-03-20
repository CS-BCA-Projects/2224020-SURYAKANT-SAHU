import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }, // Store refresh token
  resetTokenExpiry: { type: Date, default: null },
  resetToken: { type: String, default: null }
});
const Donor = mongoose.model("Donor", UserSchema);
export default Donor

