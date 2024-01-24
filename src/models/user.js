import { ObjectId } from "bson";
import mongoose, { Schema, models } from "mongoose";


const userSchema = new Schema({
    id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
    autoIncrement: true,
  },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
         unique: true,
    },
    password: {
        type: String,
        required: true
    },
},
    { timestamps: true })


const User = models.User || mongoose.model("User", userSchema)

export default User