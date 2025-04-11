import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  requestedTo:{ type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  contactNo: { type: String, required: true , sparse: true },
});
const Request = mongoose.model("request", UserSchema);
export default Request
