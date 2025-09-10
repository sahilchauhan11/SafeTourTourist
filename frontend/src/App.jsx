import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // New import
import Navbar from "./components/Navbar";

export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const socket = io("http://localhost:5000", { autoConnect: true });

  const loginWithBlockchain = async (walletAddress) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await response.json();
      setUser({
        did: data.did,
        role: data.role,
        token: data.token,
        avatar: data.avatar || "https://i.pravatar.cc/150?img=12",
      });
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Authentication failed");
    }
  };
useEffect(() => {
    if (!user || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("locationUpdate", {
          userId: user.did,
          location: { lat: latitude, lng: longitude },
          timestamp: new Date().toISOString(),
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        // Optionally notify user (avoiding alert to prevent spam)
        socket.emit("locationError", {
          userId: user?.did,
          message: err.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Clean up geolocation watch on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user, socket]);
  return (
    <AuthContext.Provider value={{ user, setUser, loginWithBlockchain }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/dashboard" element={<Dashboard socket={socket} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} /> {/* New route */}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;