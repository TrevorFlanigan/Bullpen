import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  display_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  followers: {
    type: Object,
  },
  href: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  images: {
    type: [Object],
  },
  uri: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);
export default User;
