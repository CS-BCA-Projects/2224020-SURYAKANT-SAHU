import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    FullName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    IsAdmin: { type: Boolean, default: false }, // Admin flag
    refreshToken: { type: String }, // Store refresh token
    resetTokenExpiry: { type: Date, default: null },
    resetToken: { type: String, default: null }
});

const Admin = mongoose.model("Admin", UserSchema);
export default Admin;