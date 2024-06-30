import express from "express"
import { Post } from "../models/post.js"
import { getCurrentUser } from "../utils/user.js"
import { generateSlug } from "../utils/post.js"

const router = express.Router()

router.get("/new", (req, res) => {
  res.render("post/new")
})

router.post("/new", async (req, res) => {
  const { title, content } = req.body

  if (title.trim() === "" || content.trim() === "") {
    res.render("post/new", {
      errorMessage: "Please, fill all the fields",
    })
    return
  }

  try {
    const currentUser = await getCurrentUser(req)

    const slug = generateSlug(title)

    const newPost = new Post({ title, content, slug, author: currentUser._id })
    await newPost.save()

    res.redirect("/")
  } catch (error) {
    res.render("post/new", {
      errorMessage: "Error creating post",
    })
  }
})

router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).exec()
    res.render("post/view", { post })
  } catch {
    res.redirect("/")
  }
})

router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec()
    const currentUser = await getCurrentUser(req)

    const likedByMe = post.likes.includes(currentUser._id)
    if (!likedByMe) await addLike(post._id, currentUser._id)
    else await removeLike(post._id, currentUser._id)

    res.redirect("back")
  } catch {
    res.redirect("back")
  }
})

async function addLike(postId, userId) {
  try {
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
  } catch (error) {
    throw error
  }
}

async function removeLike(postId, userId) {
  try {
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    )
  } catch (error) {
    throw error
  }
}

export { router as postRouter }