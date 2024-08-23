"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    if (!message.trim()) return; // Don't send empty messages

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box  //holds everything
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    bgcolor={"#A2A3BB"}
  >
    <Stack // this is for the entire box that holds the messages, textfield and send button
      direction="column"
      width="90vw"
      height="80vh"
      border="1px solid #424242"
      borderRadius="12px"
      p={3}
      spacing={3}
      bgcolor={"#FBF9FF"}
      boxShadow="0px 10px 20px rgba(0, 0, 0, 0.2)"
      position="relative"
    >
      <Stack //this contains the messages
        direction="column"
        spacing={2}
        p={2}
        flexGrow={1}
        overflow="auto"
        maxHeight="100%"
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
            p={2}
          >
            <Box  //for the messages text and content inside
              bgcolor={message.role === "assistant" ? "#B3B7EE" : "#9395D3"}
              color="black"
              borderRadius="12px"
              p={3}
              lineHeight={1.6}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              sx={{
                fontSize: {
                  xs: "0.875rem",
                  sm: "0.875rem",
                  md: "1rem",
                  lg: "1rem",
                  xl: "1rem",
                },
              }}
            >
              {message.content}
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Type a message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          sx={{
            bgcolor: "white",
            borderRadius: "8px",
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            bgcolor: "#000807",
            color: "#fff",
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "#3a3524",
            },
          }}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </Stack>
    </Stack>
  </Box>
  );
}
