import React, { useState } from "react";
import "./Rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState(["Chat Messi", "Room Bad Bunny", "Room 3", "Room 4", "Room 5"]);

  return (
    <div className="rooms-container">
      <div className="rooms-card">
        <h1>Rooms</h1>
        <div className="rooms-list">
          {rooms.map((room, index) => (
            <RoomItem key={index} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomItem({ room }) {
  return (
    <div className="room-item">
      <i className="fas fa-user-circle"></i>
      <span>{room}</span>
    </div>
  );
}
