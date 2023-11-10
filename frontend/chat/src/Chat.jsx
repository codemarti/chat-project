import { useEffect, useState } from "react"
import { Card, Container, Form, Message, Divider, Icon } from "semantic-ui-react"
import ScrollToBottom from "react-scroll-to-bottom"

const Chat = ({ socket, username, clientIP, room }) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messagesList, setMessagesList] = useState([])

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        clientIP,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
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

    return () => socket.off("receive-message", messageHandle)
  }, [socket])

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
                <input style={{border: "2px solid black"}}
                  value={currentMessage}
                  action={{
                    color: "red",
                    labelPosition: "right",
                    icon: "send",
                    content: "Send",
                    onClick: sendMessage
                  }}
                  type="text" name="" id="" placeholder="Message..." onChange={e => setCurrentMessage(e.target.value)
                  }
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
