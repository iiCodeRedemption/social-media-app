import slugify from "slugify"

export function generateSlug(title) {
  return slugify(title, { lower: true, trim: true })
}