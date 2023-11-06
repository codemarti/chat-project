const Chat = ({ socket, username, clientIP, room }) => {
  const [currentMessage, setCurrentMessage] = useState("")

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        clientIP,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + " Hours",
      }

      await socket.emit("send-message", info)
    }
  }

  return (
    <div>
      <section className="chat-header">
        <p>Live chat</p>
      </section>
      <section className="chat-messages">

      </section>
      <section className="chat-footer">
        <input type="text" name="" id="" placeholder="Message..." onChange={e => setCurrentMessage(e.target.value)} />

        <button onClick={sendMessage}>Send &#9658;</button>
      </section>
    </div>
  )
}

export default Chat
