import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import PortalLayout from "../layout/PortalLayout";
import io from 'socket.io-client'
import Chat from "./Chat";
import { Container, Card, Form, Button } from 'semantic-ui-react'
import Usuarios from "./Usuarios";

interface Todo {
  _id: string,
  idUser: string,
  title: string,
  completed: boolean
}

// pasamos la direccion del backend al cliente
const socketToConnect = io("http://localhost:5000")

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [room, setRoom] = useState("")
  // ahora obtendremos la ip del cliente
  const [clientIP, setClientIP] = useState("")
  // ahora se hara la visibilidad del chat
  const [showChat, setShowChat] = useState(false)

  const auth = useAuth()

  const joinRoom = () => {
    if (auth.getUser()?.username !== "" && room !== "") {
      const username = auth.getUser()?.username
      socketToConnect.emit("join-room", {username, room})
      // socketToConnect.emit('join-room', { room, username: auth.getUser()?.username });
      // Manejar la dirección IP enviada por el servidor
      socketToConnect.on("client-ip", (ip) => {
        setClientIP(ip)
      })
      console.log("a",clientIP)

      // hacemos visible el chat
      setShowChat(true)
    }
  }

  useEffect(() => { loadTodos() }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    createTodo()
  }

  async function createTodo() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`
        },
        body: JSON.stringify({
          title
        })
      })

      if (response.ok) {
        const json = await response.json()
        setTodos([json, ...todos])
      } else {
        // error
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      })

      if (response.ok) {
        const json = await response.json()
        setTodos(json)
        console.log(json)
      } else {
        // mostrar error de conexion
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(clientIP)

  return (
    <PortalLayout clientIP={clientIP}>
      <Container>
        {!showChat ? (
          <Card fluid>
            <Card.Content header="Join to chat" />
            <Card.Content>
              <Form>
                <Form.Field hidden >
                  <input type="text" value={auth.getUser()?.username} hidden />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="">Room</label>
                  <input type="text" name="" id="" placeholder="Enter a room name to create your chat room..." onChange={e => setRoom(e.target.value)} />
                </Form.Field>
                <Button type="submit" onClick={joinRoom}>Join</Button>
              </Form>
            </Card.Content>
          </Card>
        ) : (
          <Chat socket={socketToConnect} username={auth.getUser()?.username} clientIP={clientIP} room={room} setClientIP={setClientIP} />          
        )}
        {/* Muestra la tabla de usuarios solo si clientIP es "::1" */}
        {showChat && auth.getUser()?.username === "servidor" && <Usuarios socketToConnect={socketToConnect} />}
      </Container>
    </PortalLayout>
  )
}
