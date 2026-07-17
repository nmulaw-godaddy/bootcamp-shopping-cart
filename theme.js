import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5C93',
      dark: '#E9427C',
      light: '#FFC6D9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF8AAE',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFEDF5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#432818',
      secondary: '#7A6A61',
    },
    error: {
      main: '#D32F2F',
    },
    divider: '#F5CEDC',
  },
  typography: {
    fontFamily: '"Poppins", "Nunito", "Roboto", sans-serif',
    h1: { fontWeight: 700, color: '#432818' },
    h2: { fontWeight: 700, color: '#432818' },
    h3: { fontWeight: 700, color: '#432818' },
    h4: { fontWeight: 700, color: '#432818' },
    h5: { fontWeight: 600, color: '#432818' },
    h6: { fontWeight: 600, color: '#432818' },
    button: { fontWeight: 600, textTransform: 'none' },
    body1: { color: '#432818' },
    body2: { color: '#7A6A61' },
    subtitle1: { color: '#432818' },
    subtitle2: { color: '#7A6A61' },
    caption: { color: '#7A6A61' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFEDF5',
          color: '#432818',
        },
        'a:visited': {
          color: 'inherit',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          padding: '10px 24px',
          fontFamily: '"Poppins", "Nunito", "Roboto", sans-serif',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
          boxShadow: '0 4px 15px rgba(255, 92, 147, 0.3)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF4F87, #E9427C)',
            boxShadow: '0 6px 20px rgba(255, 92, 147, 0.4)',
          },
          '&.Mui-disabled': {
            background: 'rgba(255, 92, 147, 0.15)',
            color: 'rgba(67, 40, 24, 0.35)',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#F5CEDC',
          color: '#FF5C93',
          '&:hover': {
            borderColor: '#FF5C93',
            backgroundColor: 'rgba(255, 92, 147, 0.04)',
          },
        },
        text: {
          color: '#FF5C93',
          '&:hover': {
            backgroundColor: 'rgba(255, 92, 147, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #F5CEDC',
          boxShadow: '0 8px 24px rgba(255, 92, 147, 0.08)',
          backgroundColor: '#FFFFFF',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: '#F5CEDC' },
            '&:hover fieldset': { borderColor: '#FF8AAE' },
            '&.Mui-focused fieldset': { borderColor: '#FF5C93', borderWidth: 2 },
          },
          '& .MuiInputBase-input': { color: '#432818' },
          '& .MuiInputBase-input::placeholder': { color: '#7A6A61', opacity: 1 },
          '& .MuiInputLabel-root': { color: '#7A6A61' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#FF5C93' },
          '& .MuiFormHelperText-root': { color: '#7A6A61' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontFamily: '"Poppins", "Nunito", "Roboto", sans-serif',
          fontWeight: 600,
        },
        colorError: {
          backgroundColor: '#FF5C93',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#432818',
          boxShadow: '0 2px 12px rgba(255, 92, 147, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FF5C93',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.65rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#F5CEDC',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontFamily: '"Poppins", "Nunito", "Roboto", sans-serif',
        },
        standardSuccess: {
          backgroundColor: '#F0FBF5',
          color: '#2D6A4F',
          border: '1px solid #A8E6CF',
        },
        standardError: {
          backgroundColor: '#FFF0F3',
          color: '#C62828',
          border: '1px solid #FFC6D9',
        },
        standardInfo: {
          backgroundColor: '#F0F7FF',
          color: '#1565C0',
          border: '1px solid #7ED6FF',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: '1px solid #F5CEDC',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: '1px solid #F5CEDC',
          boxShadow: '0 12px 30px rgba(255, 92, 147, 0.15)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 92, 147, 0.08)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FF6BA3, #FF4F87)',
          color: '#ffffff',
          boxShadow: '0 6px 20px rgba(255, 92, 147, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF4F87, #E9427C)',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#FF5C93',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F5CEDC',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF8AAE',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF5C93',
          },
          color: '#432818',
        },
      },
    },
  },
});

export default theme;
