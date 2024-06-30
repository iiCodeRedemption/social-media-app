import express from "express"
import { User } from "../models/user.js"
import { verifyPassword, hashPassword } from "../utils/password.js"

const router = express.Router()

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Username and password are required",
    })
    return
  }

  try {
    const targetUser = await User.findOne({ name: username }).exec()
    if (!targetUser) {
      res.render("auth/login", {
        errorMessage: "User not found",
      })
      return
    }

    const validPassword = await verifyPassword(password, targetUser.password)
    if (!validPassword) {
      res.render("auth/login", {
        errorMessage: "Wrong password",
      })
      return
    }
  
    const { password: _, ...user } = targetUser.toObject()
  
    req.session.userId = user._id.toString()
    res.redirect("/")
  } catch {
    res.render("auth/login", {
      errorMessage: "Error logging in",
    })
  }
})

router.get("/register", (req, res) => {
  res.render("auth/register")
})

router.post("/register", async (req, res) => {
  const { username, password } = req.body

  if (username.trim() === "" || password.trim() === "") {
    res.render("auth/login", {
      errorMessage: "Email and password are required",
    })
    return
  }

  try {
    const existingUser = await User.findOne({ name: username }).exec()
    if (existingUser) {
      res.render("auth/register", {
        errorMessage: "User already exists",
      })
      return
    }

    const hashedPassword = await hashPassword(password)
  
    const newUser = new User({ name: username, password: hashedPassword })
    await newUser.save()

    res.redirect("/auth/login")
  } catch {
    res.render("auth/register", {
      errorMessage: "Error creating user",
    })
  }
})

router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send("Error logging out")
      return
    }
    
    res.redirect("/auth/login")
  })
})

export { router as authRouter }
