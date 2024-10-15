export default {
  jwt: {
    secret: String(process.env.JWT_KEY),
    expiresIn: "1d"
  }
}