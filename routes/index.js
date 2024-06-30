import express from "express"
import { getCurrentUser } from "../utils/user.js"
import { Post } from "../models/post.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const user = await getCurrentUser(req)
    const posts = await Post.find().populate("author").exec()
    res.render("index", { user, posts })
  } catch {
    res.status(500).send("An unexpected error ocurred")
  }
})

export { router as indexRouter }
