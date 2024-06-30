import express from "express"
import { User } from "../models/user.js"

const router = express.Router()

router.get("/:id/profile", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id).select("-password").exec()
    res.render("user/profile", { user: targetUser })
  } catch {
    res.redirect("/")
  }
})

export { router as userRouter }