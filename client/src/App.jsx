import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {

  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
      }), []);


  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(messages);


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (e) => {
      console.log(e);
    });

    socket.on("welcome1", (e) => {
      console.log(e);
    });

    socket.on("recived-message", (e) => {
      console.log(e);
      setMessages((prev) => [...prev, e]);
    })

    return () => {
      socket.disconnect();
    };

  }, [socket]);

  return (
   
    <Container maxWidth="sm">

      <Box sx={{ height: 200 }} />
      <Typography variant="h5" component="div" gutterBottom>
        Chat App
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        {socketID ? `Socket ID: ${socketID}` : "CONNECTING...."}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>



      <form onSubmit={handleSubmit}>
        <TextField value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="message"
          variant="outlined" />

        <TextField value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined" />

        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>


      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>

    </Container>
  );
}

export default App

