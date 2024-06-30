import { User } from "../models/user.js"

export async function getCurrentUser(req) {
  try {
    const userId = req.session.userId
    if (!userId) throw new Error("User ID not found")

    const user = await User.findById(userId).select("-password").exec()
    return user
  } catch (err) {
    throw err
  }
}