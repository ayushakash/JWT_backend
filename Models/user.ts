import mongoose, { Schema, model, connect } from 'mongoose';
const { v4: uuid } = require('uuid');

export interface IUser extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
    role: string;
}

const userSchema = new Schema({
    _id: { type: String, required: true, default: uuid() },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
});

//   module.exports = mongoose.model("User",userSchema);
const User = mongoose.model<IUser>('User', userSchema);
export default User;