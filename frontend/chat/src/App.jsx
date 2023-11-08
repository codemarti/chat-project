import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import { Container, Card, Form, Button } from "semantic-ui-react";

// const socketToConnect = io.connect("http://localhost:1234");
const socketToConnect = io.connect("http://192.168.128.10:1234");

function App() {
  // dentro de esta constante pueden ir varias caracteristicas del usuario
  const [username, setUsername] = useState("");
  // ahora se crearan las salas para que el chat de ese canal no se filtre con el chat de otro canal o sala
  const [room, setRoom] = useState("");
  // ahora obtendremos la ip del cliente
  const [clientIP, setClientIP] = useState("");
  // ahora se hara la visibilidad del chat
  const [showChat, setShowChat] = useState(false);

  // ahora haremos la funcion que nos permita hacer que las personas se unan al chat o la sala o room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socketToConnect.emit("join-room", room);

      // Manejar la dirección IP enviada por el servidor
      socketToConnect.on("client-ip", (ip) => {
        setClientIP(ip);
      });

      setShowChat(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#EBEBEB", // Color de fondo del contenido
        }}
      >
        <Container>
          {!showChat ? (
            <Card
              fluid
              style={{
                backgroundColor: "#FFFFFF",
              }}
            >
              <Card.Content
                header="Join to chat"
                style={{
                  backgroundColor: "#128C7E",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
              <Card.Content>
                <Form>
                  <Form.Field>
                    <label htmlFor="">Username:</label>
                    <Form.Input
                      icon="user"
                      iconPosition="left"
                      type="text"
                      name=""
                      id=""
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    ></Form.Input>
                  </Form.Field>
                  <Form.Field>
                    <label htmlFor="">Room</label>
                    <Form.Input
                      icon="hashtag"
                      iconPosition="left"
                      placeholder="Room ID"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </Form.Field>
                  <Button type="submit" color="green" onClick={joinRoom}>
                    Submit
                  </Button>
                </Form>
              </Card.Content>
              {/* <Card.Content extra>
          <Icon name='user' /> Friends
        </Card.Content> */}
            </Card>
          ) : (
            <Chat
              socket={socketToConnect}
              username={username}
              clientIP={clientIP}
              room={room}
            />
          )}
        </Container>
      </div>
    </div>
  );
}

export default App;
