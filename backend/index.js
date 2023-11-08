const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")

app.use(cors())

// Puerto del servidor
const PORT = process.env.PORT ?? 1234
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    // puerto del cliente permitido
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  // console.log("Current user: " + socket.request.socket.localAddress)
  console.log("Current user: " + socket.id)

  socket.on("join-room", (data) => {
    socket.join(data)

    // Obtener la dirección IP del cliente
    const clientIp = getClientIp(socket.request)
    console.log("User connected with id: " + socket.id + " and IP address: " + clientIp + " has joined in room: " + data)

    // Enviar la dirección IP al cliente
    socket.emit("client-ip", clientIp)
  })

  socket.on("send-message", (data) => {
    // console.log("Message received")
    // console.log(data)
    socket.to(data.room).emit("receive-message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected with id: ", socket.id)
  })
})


server.listen(PORT, () => {
  console.log("Server listening on port: " + PORT)
})

const getClientIp = (request) => {
  // Intentar obtener la dirección IPv4
  let clientIp = request.socket.remoteAddress

  // Verificar si es una dirección IPv6
  if (clientIp && clientIp.includes("::ffff:")) {
    clientIp = clientIp.replace("::ffff:", "")
  }

  return clientIp
}
