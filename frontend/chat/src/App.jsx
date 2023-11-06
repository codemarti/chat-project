import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'

const socketToConnect = io.connect('http://localhost:1234')

function App () {
  // dentro de esta constante pueden ir varias caracteristicas del usuario
  const [username, setUsername] = useState("")
  // ahora se crearan las salas para que el chat de ese canal no se filtre con el chat de otro canal o sala
  const [room, setRoom] = useState("")
  // ahora obtendremos la ip del cliente
  const [clientIP, setClientIP] = useState("")

  // ahora haremos la funcion que nos permita hacer que las personas se unan al chat o la sala o room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socketToConnect.emit("join-room", room)

      // Manejar la dirección IP enviada por el servidor
      socketToConnect.on("client-ip", (ip) => {
        setClientIP(ip)
      })
    }
  }

  return (
    <>
      <div className='chat'>
        <h3>Unirme al chat</h3>
        <input type="text" name="" id="" placeholder="Martin.." onChange={e => setUsername(e.target.value)} />
        <input type="text" name="" id="" placeholder="ID Room: " onChange={e => setRoom(e.target.value)} />

        <button onClick={joinRoom}>Unirme</button>
        <Chat socket={socketToConnect} username={username} clientIP={clientIP} room={room} />
      </div>
    </>
  )
}

export default App
