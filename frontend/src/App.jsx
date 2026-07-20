import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

import "./styles/theme.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;