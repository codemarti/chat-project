import { useEffect, useState } from "react"
import { Card, Container, Form, Message, Divider, Icon } from "semantic-ui-react"
import ScrollToBottom from "react-scroll-to-bottom"

const Chat = ({ socket, username, clientIP, setClientIP, room }) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messagesList, setMessagesList] = useState([])

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        clientIP,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + " Hours"
      }
      await socket.emit("send-message", info)

      // para modificar nuestra lista de mensajes con la informacion que esta
      setMessagesList((list) => [...list, info])
      setCurrentMessage("")
    }
  }

  useEffect(() => {
    const messageHandle = (data) => {
      setMessagesList((list) => [...list, data])
    }

    socket.on("receive-message", messageHandle)

    // Actualizar la dirección IP cuando se recibe del servidor
    socket.on("client-ip", (ip) => {
      setClientIP(ip);
    });

    return () => socket.off("receive-message", messageHandle)
  }, [socket, setClientIP])

  return (
    <Container>
      <Card fluid>
        <Card.Content header={`Live chat | Sala: ${room}`} />
        <ScrollToBottom>
          <Card.Content style={{ height: "400px", padding: "5px" }}>
            {
              messagesList.map((item, i) => {
                return (
                  <span key={i}>
                    <Message style={{ textAlign: username === item.author ? "right" : "left" }}
                      success={username === item.author}
                      info={username !== item.author}
                    >
                      <Message.Header>{item.message}</Message.Header>
                      <p>
                        <i>
                          <strong>IP Address: {item.clientIP}</strong>
                        </i> | Sended by: <strong>{item.author}</strong> at {item.time}
                      </p>
                    </Message>
                    <Divider />
                  </span>
                )
              })
            }
          </Card.Content>
        </ScrollToBottom>
        <Card.Content extra>
          <Form>
            <Form.Field>
              <div className="ui action input">
                <input
                  value={currentMessage}
                  action={{
                    color: "black",
                    labelPosition: "right",
                    icon: "send",
                    content: "Send",
                    onClick: sendMessage
                  }}
                  type="text" name="" id="" placeholder="Message..." onChange={e => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage()
                  }}
                />
                <button type="button" className="ui black icon right labeled button" onClick={() => sendMessage()}>
                  <Icon name="send" />
                  Send
                </button>
              </div>
            </Form.Field>
          </Form>
        </Card.Content>
      </Card>
    </Container >
  )
}

export default Chat
