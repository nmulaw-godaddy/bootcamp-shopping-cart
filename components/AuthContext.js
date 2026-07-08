import React, { createContext, useContext, useEffect, useState } from 'react';

// This is a demo-only "auth" system: accounts and sessions live in the
// browser's localStorage instead of a real server/database. Good for
// showing how login *flows* work, not for storing real passwords.
const AuthContext = createContext(null);

const USERS_KEY = 'doughmain_users';
const SESSION_KEY = 'doughmain_session';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On first load in the browser, restore whoever was logged in last time.
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const signup = (name, email, password) => {
    const users = loadUsers();
    if (users.some((u) => u.email === email)) {
      return { error: 'An account with that email already exists.' };
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, { name, email, password }]));
    const session = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { error: null };
  };

  const login = (email, password) => {
    const match = loadUsers().find((u) => u.email === email && u.password === password);
    if (!match) {
      return { error: 'Email or password is incorrect.' };
    }
    const session = { name: match.name, email: match.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { error: null };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
