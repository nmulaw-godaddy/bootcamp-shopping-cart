import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, CircularProgress, IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import doughmainLogo from '../images/doughmains.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const QUICK_PROMPTS = [
  'What should I add?',
  'What is on sale?',
  'Best for security?',
  'Best domain option?',
];

const DonutAvatar = () => (
  <Box
    component="img"
    src={doughmainLogo.src}
    alt=""
    aria-hidden="true"
    sx={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
  />
);

const ChatFab = ({ onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    aria-label="open support chat"
    sx={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
      boxShadow: '0 6px 20px rgba(255,92,147,0.45)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      '&:hover': {
        transform: 'scale(1.08)',
        boxShadow: '0 8px 28px rgba(255,92,147,0.55)',
      },
      '&:focus-visible': {
        outline: '2px solid #FF5C93',
        outlineOffset: 3,
      },
    }}
  >
    <Box
      component="img"
      src={doughmainLogo.src}
      alt=""
      sx={{ width: 32, height: 32, objectFit: 'contain' }}
    />
  </Box>
);

function ShoppingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hey there! I'm Long John. I can help you find the right product, add items to your cart, or answer any questions.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (quickPromptText) => {
    const messageText = (quickPromptText || input).trim();
    if (!messageText || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || 'Sorry, I could not generate a recommendation.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I could not connect to the chatbot service.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (message) => {
    const isTobyMessage =
      message.sender === 'bot' &&
      message.text.toLowerCase().includes('best cat') &&
      message.text.toLowerCase().includes('toby');

    const bubbleSx = {
      px: 1.75,
      py: 1,
      borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      display: 'inline-block',
      maxWidth: '100%',
      fontSize: '0.85rem',
      lineHeight: 1.55,
      whiteSpace: 'pre-line',
      ...(message.sender === 'user'
        ? { background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)', color: '#fff' }
        : { backgroundColor: '#FFFFFF', color: '#432818', border: '1.5px solid #F5CEDC' }),
    };

    if (!isTobyMessage) {
      return <Box sx={bubbleSx}>{message.text}</Box>;
    }

    const messageParts = message.text.split('\n\n');
    const firstPart = messageParts[0];
    const remainingText = messageParts.slice(1).join('\n\n');

    return (
      <>
        <Box sx={bubbleSx}>{firstPart}</Box>
        <Box
          component="img"
          src="/images/toby.png"
          alt="Toby the cat"
          sx={{ display: 'block', width: 140, maxWidth: '100%', mt: 1, borderRadius: '12px', border: '2px solid #F5CEDC' }}
        />
        {remainingText && <Box sx={{ ...bubbleSx, mt: 1 }}>{remainingText}</Box>}
      </>
    );
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <Box
          sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}
        >
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F5CEDC',
              borderRadius: '12px',
              px: 2,
              py: 1,
              boxShadow: '0 4px 16px rgba(255,92,147,0.15)',
              maxWidth: 200,
            }}
          >
            <Typography variant="caption" sx={{ color: '#432818', fontWeight: 500 }}>
              Need help picking a product?
            </Typography>
          </Box>
          <ChatFab onClick={() => setIsOpen(true)} />
        </Box>
      )}

      {/* Chat window */}
      {isOpen && (
        <Box
          role="dialog"
          aria-label="Long John Chat"
          sx={{
            position: 'fixed',
            right: { xs: 8, sm: 24 },
            bottom: { xs: 8, sm: 24 },
            width: { xs: 'calc(100vw - 16px)', sm: 360 },
            maxWidth: 400,
            height: { xs: 'calc(100vh - 16px)', sm: 560 },
            maxHeight: '90vh',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #F5CEDC',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(255,92,147,0.2)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
              px: 2.5,
              py: 1.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <DonutAvatar />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Long John
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#A8E6CF' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.7rem' }}>
                  We&apos;re Online
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              aria-label="close chat"
              sx={{ color: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flex: 1,
              px: 2,
              py: 2,
              overflowY: 'auto',
              backgroundColor: '#FFF7FB',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}
              >

                <Box sx={{ display: 'inline-block', maxWidth: '85%', textAlign: 'left' }}>
                  {renderMessageContent(message)}
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    px: 1.75, py: 1, backgroundColor: '#FFFFFF', border: '1.5px solid #F5CEDC',
                    borderRadius: '18px 18px 18px 4px', display: 'flex', alignItems: 'center', gap: 1,
                  }}
                >
                  <CircularProgress size={12} sx={{ color: '#FF5C93' }} />
                  <Typography variant="caption" sx={{ color: '#7A6A61', fontSize: '0.78rem' }}>
                    Typing...
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Suggested prompts */}
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#7A6A61', mb: 0.75, display: 'block', fontWeight: 500 }}>
                Suggested questions
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {QUICK_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    size="small"
                    variant="outlined"
                    disabled={loading}
                    onClick={() => sendMessage(prompt)}
                    sx={{
                      borderRadius: 999,
                      borderColor: '#F5CEDC',
                      color: '#432818',
                      fontSize: '0.72rem',
                      py: 0.4,
                      px: 1.25,
                      fontWeight: 500,
                      backgroundColor: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#FF5C93', backgroundColor: '#FFF0F6', color: '#FF5C93' },
                      '&.Mui-disabled': { borderColor: '#F5CEDC', color: '#7A6A61', opacity: 0.5 },
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </Box>
            </Box>

            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              display: 'flex',
              gap: 1,
              borderTop: '1.5px solid #F5CEDC',
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter message here..."
              aria-label="chat message input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  backgroundColor: '#FFF7FB',
                  '& fieldset': { borderColor: '#F5CEDC' },
                  '&:hover fieldset': { borderColor: '#FF8AAE' },
                  '&.Mui-focused fieldset': { borderColor: '#FF5C93' },
                  '& input': { color: '#432818', fontSize: '0.875rem', py: '8px' },
                  '& input::placeholder': { color: '#7A6A61', opacity: 1 },
                },
              }}
            />
            <IconButton
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              aria-label="send message"
              sx={{
                width: 38,
                height: 38,
                background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
                color: '#fff',
                flexShrink: 0,
                borderRadius: '50%',
                '&:hover': { background: 'linear-gradient(135deg, #FF4F87, #E9427C)' },
                '&.Mui-disabled': { background: '#F5CEDC', color: '#7A6A61' },
              }}
            >
              <SendIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ShoppingChatbot;
