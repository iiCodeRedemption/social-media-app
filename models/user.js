import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
})

export const User = mongoose.model("User", userSchema)
