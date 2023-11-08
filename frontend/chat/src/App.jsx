import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'
import { Container, Card, Form, Button } from 'semantic-ui-react'

const socketToConnect = io.connect('http://localhost:1234')

function App () {
  // dentro de esta constante pueden ir varias caracteristicas del usuario
  const [username, setUsername] = useState("")
  // ahora se crearan las salas para que el chat de ese canal no se filtre con el chat de otro canal o sala
  const [room, setRoom] = useState("")
  // ahora obtendremos la ip del cliente
  const [clientIP, setClientIP] = useState("")
  // ahora se hara la visibilidad del chat
  const [showChat, setShowChat] = useState(false)

  // ahora haremos la funcion que nos permita hacer que las personas se unan al chat o la sala o room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socketToConnect.emit("join-room", room)

      // Manejar la dirección IP enviada por el servidor
      socketToConnect.on("client-ip", (ip) => {
        setClientIP(ip)
      })

      setShowChat(true)
    }
  }

  return (
    <Container>
      {!showChat ? (
        <Card fluid>
          <Card.Content header="Join to chat" />
          <Card.Content>
            <Form>
              <Form.Field>
                <label htmlFor="">Username:</label>
                <input type="text" name="" id="" placeholder="Martin.." onChange={e => setUsername(e.target.value)} />
              </Form.Field>
              <Form.Field>
                <label htmlFor="">Room</label>
                <input type="text" name="" id="" placeholder="ID Room: " onChange={e => setRoom(e.target.value)} />
              </Form.Field>
              <Button type="submit" onClick={joinRoom}>Submit</Button>
            </Form>
          </Card.Content>
          {/* <Card.Content extra>
          <Icon name='user' /> Friends
        </Card.Content> */}
        </Card>
      ) : (
        <Chat socket={socketToConnect} username={username} clientIP={clientIP} room={room} />
      )}
    </Container>
  )
}

export default App
