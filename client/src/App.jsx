import { Box, Button, Container, createTheme, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const socket = useMemo(
    () =>
      io("https://chatingmaster.onrender.com", {
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
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, backgroundColor: "#7cc6e6", borderRadius: 2, p: 3 }}>
        <Box sx={{ height: 200 }} />
        <Typography variant="h4" component="div" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Chat App
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          {socketID ? `Socket ID: ${socketID}` : "CONNECTING...."}
        </Typography>

        <Box component="form" onSubmit={joinRoomHandler} sx={{ mb: 3, mt: 3 }}>
          <Box display="flex" alignItems="center" spacing={2}>
            <TextField
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              label="Room Name"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Join
            </Button>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Message"
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              label="Room"
              variant="outlined"
              size="small"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!message || !room}
            >
              Send
            </Button>
          </Stack>
        </Box>

        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
