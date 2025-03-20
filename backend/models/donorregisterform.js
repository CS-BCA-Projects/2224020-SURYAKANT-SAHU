import mongoose from "mongoose";

// Function to capitalize each word in a string
function capitalize(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

const UserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true }, // Linking User
  First_Name: { type: String, required: true },
  Last_Name: { type: String, required: true },
  BloodGroup: { type: String, required: true },
  DOB: { type: Date, required: true },
  Email: { type: String, required: true, unique: true, lowercase: true }, // Ensures email is always lowercase
  Age: { type: Number, required: true },
  Gender: { type: String, required: true },
  State: { type: String, required: true },
  District: { type: String, required: true },
  Block: { type: String, required: true },
  Pincode: { type: String, required: true }, // Changed to String to preserve leading zeros
  ContactNo: { type: String, required: true , sparse: true }, // Changed to String to prevent truncation
  Weight: { type: Number, required: true },
  Profession: { type: String, required: true },
});

// **Middleware to Capitalize Fields Before Saving**
UserSchema.pre("save", function (next) {
  this.First_Name = capitalize(this.First_Name);
  this.Last_Name = capitalize(this.Last_Name);
  this.State = capitalize(this.State);
  this.District = capitalize(this.District);
  this.Block = capitalize(this.Block);
  this.Profession = capitalize(this.Profession);
  this.BloodGroup = this.BloodGroup.toUpperCase(); // Ensure blood group is always uppercase
  next();
});

const Donorregister = mongoose.model("Donorregister", UserSchema);
export default Donorregister;
