export function middleware(req, res, next) {
  if (req.path.startsWith("/auth")) {
    next()
    return
  }

  if (!req.session.userId) {
    res.redirect("/auth/login")
    return
  }

  res.locals.userId = req.session.userId

  next()
}