import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

export async function hashPassword(password, salt = SALT_ROUNDS) {
  return await bcrypt.hash(password, salt)
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
