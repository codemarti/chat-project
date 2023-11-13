const Todo = require("../schema/todo")

const router = require("express").Router()

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ idUser: req.user.id })
    if (todos)
      res.json(todos)
    else
      res.status(404).json({ error: "No todos found" })
  } catch (error) {
    console.log(error)
  }
})

router.post("/", async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ error: "Title is required" })
  }

  try {
    const todo = new Todo({
      idUser: req.user.id,
      title: req.body.title,
      completed: false,
    })

    const todoInfo = await todo.save()
    console.log({ "todoInfo": todoInfo, "todoNormal": todo })
    res.json(todoInfo)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al crear el todo" })
  }
})


module.exports = router
