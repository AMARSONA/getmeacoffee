import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: { type: String},
    email: { type: String, required: true},
    username: { type: String, required: true},
    profilepic: { type: String },
    coverpic: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    razorpayid: { type: String},
    razorpaysecret: { type: String}
});

// const User = model("User", userSchema);
export default mongoose.models.User || model("User", UserSchema);