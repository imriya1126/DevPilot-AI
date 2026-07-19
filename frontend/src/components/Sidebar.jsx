import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Sidebar.css";

export default function Sidebar({
  onNewChat,
  onSelectChat,
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get("/ai/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const deleteChat = async (id) => {
    try {
      await API.delete(`/ai/chat/${id}`);

      setHistory((prev) =>
        prev.filter((chat) => chat.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete chat");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <h2>🤖 DevPilot AI</h2>

      <button
        className="new-chat"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      <div className="history">
        <p className="history-title">
          Recent Chats
        </p>

        {history.length === 0 ? (
          <p>No chats yet</p>
        ) : (
          history.map((chat) => (
            <div
              key={chat.id}
              className="history-item"
              onClick={() => onSelectChat(chat)}
            >
              <span className="history-text">
                {chat.prompt}
              </span>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                title="Delete Chat"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <button
        className="logout"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}