import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") dotenv.config()

import express from "express"
import expressLayouts from "express-ejs-layouts"
import expressSession from "express-session"
import bodyParser from "body-parser"
import mongoose from "mongoose"

import { indexRouter } from "./routes/index.js"
import { authRouter } from "./routes/auth.js"
import { userRouter } from "./routes/user.js"
import { postRouter } from "./routes/post.js"
import { middleware } from "./middleware.js"

const PORT = process.env.PORT || 3000

const app = express()

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
)

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to database"))

app.use(middleware)

app.use("/", indexRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
