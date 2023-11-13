const Mongoose = require("mongoose")

const RoomSchema = new Mongoose.Schema({
  id: { type: Object },
  roomName: { type: String, required: true }
})

module.exports = Mongoose.model("Room", RoomSchema)
