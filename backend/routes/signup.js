const router = require("express").Router()
const { jsonResponse } = require("../lib/jsonResponse")
const User = require("../schema/user.js")

router.post("/", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json(jsonResponse(400, {
      error: "Fields are required"
    }))
  }

  // crear el usuario en la base de datos
  try {
    const user = new User()
    const userExist = await user.usernameExist(username)
    if (userExist) {
      return res.status(400).json(
        jsonResponse(400, {
          error: "Username already exist"
        })
      )
    }

    const newUser = new User({ username, password })

    await newUser.save()

    res.status(200).json(jsonResponse(200, { message: "User created successfully" }))
  } catch (error) {
    res.status(500).json(
      jsonResponse(500, {
        error: "Error creating user"
      })
    )
  }
})

module.exports = router
