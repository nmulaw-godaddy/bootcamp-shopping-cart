import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

function ShoppingChatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi, I can help you decide what to add to your cart.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const messageText = input.trim();

    if (!messageText) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: 'user',
        text: messageText
      }
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText
        })
      });

      const data = await response.json();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: 'bot',
          text: data.reply || 'Sorry, I could not generate a recommendation.'
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: 'bot',
          text: 'Sorry, I could not connect to the chatbot service.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shopping Assistant
      </Typography>

      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        Ask for help choosing what to add to your cart.
      </Typography>

      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: 1,
          padding: 2,
          height: 260,
          overflowY: 'auto',
          marginBottom: 2,
          backgroundColor: '#fafafa'
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              marginBottom: 1,
              textAlign: message.sender === 'user' ? 'right' : 'left'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                padding: 1,
                borderRadius: 1,
                maxWidth: '80%',
                backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#ffffff'
              }}
            >
              {message.text}
            </Typography>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">Thinking...</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask what you should add to your cart..."
        />

        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default ShoppingChatbot;