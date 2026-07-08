import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Fab,
  IconButton
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

function ShoppingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I can help you decide what to add to your cart, or anything else you need help with.'
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
    <>
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: '10px 14px',
              backgroundColor: '#2f3136',
              color: '#ffffff',
              borderRadius: 1
            }}
          >
            <Typography variant="body2">
              Need help picking a product?
            </Typography>
          </Paper>

          <Fab
            color="primary"
            aria-label="open shopping chatbot"
            onClick={() => setIsOpen(true)}
          >
            <ChatIcon />
          </Fab>
        </Box>
      )}

      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            width: 360,
            maxWidth: '90vw',
            height: 500,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2f3136',
            color: '#ffffff',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              padding: 2,
              borderBottom: '1px solid #555',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">
              Chat Bot - Help
            </Typography>

            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{
                color: '#ffffff'
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ padding: '8px 16px' }}>
            <Typography variant="body2" sx={{ color: '#64a6ff', fontWeight: 'bold' }}>
              We&apos;re Online
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              padding: 2,
              overflowY: 'auto',
              backgroundColor: '#2b2b2b'
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    padding: 1.25,
                    borderRadius: 1,
                    maxWidth: '80%',
                    color: '#ffffff',
                    backgroundColor: message.sender === 'user' ? '#9aa3ad' : '#4f7fb8',
                    textAlign: 'left',
                    whiteSpace: 'pre-line'
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

          <Box
            sx={{
              padding: 1.5,
              display: 'flex',
              gap: 1,
              backgroundColor: '#2f3136'
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter message here..."
              sx={{
                backgroundColor: '#e8eef5',
                borderRadius: 5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5
                }
              }}
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
      )}
    </>
  );
}

export default ShoppingChatbot;