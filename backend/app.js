const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const authenticate = require('./auth/authenticate')
const { Server } = require('socket.io')

require('dotenv').config()

const port = process.env.PORT || 5000
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

async function connectToDatabase () {
  await mongoose.connect(process.env.DB_CONNECTION_STRING)
  console.log('Connected to MongoDB')
}

connectToDatabase().catch(console.error)

app.use(cors())
app.use(express.json())

app.use('/api/signup', require('./routes/signup'))
app.use('/api/login', require('./routes/login'))
app.use('/api/user', authenticate, require('./routes/user'))
app.use('/api/todos', authenticate, require('./routes/todos'))
app.use('/api/refresh-token', require('./routes/refreshToken'))
app.use('/api/signout', require('./routes/signout'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('Current user: ' + socket.id)

  socket.on('join-room', (data) => {
    socket.join(data)

    const clientIp = getClientIp(socket.request)
    console.log('User connected with id: ' + socket.id + ' and IP: ' + clientIp + ' has joined in room: ' + data.room + ' username: ' + data.username)

    // Agregar usuario a connectedUsers
    if (clientIp === "::1"){
      connectedUsers.add({ 
        id: socket.id,
        username: data.username, 
        ip: clientIp
      })
  
      // Emitir la lista actualizada a todos los clientes
      io.emit('connected-users', Array.from(connectedUsers))
  
      socket.on('disconnect', () => {
        connectedUsers.delete(socket.id)
        io.emit('connected-users', Array.from(connectedUsers)) 
      })
    }

    socket.emit('client-ip', clientIp)
  })

  socket.on('send-message', (data) => {
    socket.to(data.room).emit('receive-message', data)
    console.log(data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected with id: ', socket.id)
  })
})

server.listen(port, () => {
  console.log('Server is running on port: ' + port)
})

const getClientIp = (request) => {
  let clientIp = request.socket.remoteAddress

  if (clientIp && clientIp.includes('::ffff:')) {
    clientIp = clientIp.replace('::ffff:', '')
  }

  return clientIp
}
