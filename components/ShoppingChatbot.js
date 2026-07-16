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

const QUICK_PROMPTS = [
  'What should I add?',
  'What is on sale?',
  'Best for security?',
  'Best domain option?'
];

function ShoppingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I can help you decide what to add to your cart, compare products, or find the best option for your needs.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (quickPromptText) => {
    const messageText = (quickPromptText || input).trim();

    if (!messageText || loading) {
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

  const renderMessageContent = (message) => {
    const isTobyMessage =
  message.sender === 'bot' &&
  message.text.toLowerCase().includes('best cat') &&
  message.text.toLowerCase().includes('toby');

    if (!isTobyMessage) {
      return (
        <Typography
          variant="body2"
          sx={{
            display: 'inline-block',
            padding: 1.25,
            borderRadius: 1,
            color: '#ffffff',
            backgroundColor: message.sender === 'user' ? '#9aa3ad' : '#4f7fb8',
            whiteSpace: 'pre-line'
          }}
        >
          {message.text}
        </Typography>
      );
    }

    const messageParts = message.text.split('\n\n');
    const firstPart = messageParts[0];
    const remainingText = messageParts.slice(1).join('\n\n');

    return (
      <>
        <Typography
          variant="body2"
          sx={{
            display: 'inline-block',
            padding: 1.25,
            borderRadius: 1,
            color: '#ffffff',
            backgroundColor: '#4f7fb8',
            whiteSpace: 'pre-line'
          }}
        >
          {firstPart}
        </Typography>

        <Box
          component="img"
          src="/images/toby.png"
          alt="Toby the cat"
          sx={{
            display: 'block',
            width: 160,
            maxWidth: '100%',
            marginTop: 1,
            borderRadius: 2,
            border: '2px solid #4f7fb8'
          }}
        />

        {remainingText && (
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              padding: 1.25,
              borderRadius: 1,
              color: '#ffffff',
              backgroundColor: '#4f7fb8',
              whiteSpace: 'pre-line',
              marginTop: 1
            }}
          >
            {remainingText}
          </Typography>
        )}
      </>
    );
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
            height: 560,
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
                <Box
                  sx={{
                    display: 'inline-block',
                    maxWidth: '80%',
                    textAlign: 'left'
                  }}
                >
                  {renderMessageContent(message)}
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                <CircularProgress size={18} />
                <Typography variant="body2">
                  Checking your cart and products...
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#bfc7d5',
                  marginBottom: 1
                }}
              >
                Suggested questions
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap'
                }}
              >
                {QUICK_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    size="small"
                    variant="outlined"
                    disabled={loading}
                    onClick={() => sendMessage(prompt)}
                    sx={{
                      color: '#ffffff',
                      borderColor: '#7c8797',
                      borderRadius: 5,
                      textTransform: 'none',
                      fontSize: '0.72rem',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      '&:hover': {
                        borderColor: '#64a6ff',
                        backgroundColor: 'rgba(100, 166, 255, 0.12)'
                      }
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              padding: 1.5,
              display: 'flex',
              gap: 1,
              backgroundColor: '#2f3136',
              borderTop: '1px solid #444'
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
              onClick={() => sendMessage()}
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