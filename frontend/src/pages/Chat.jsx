import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Message from "../components/Message";
import ChatInput from "../components/ChatInput";
import "../styles/chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const loadHistory = async () => {
    try {
      const res = await API.get("/ai/history");

      const history = [];

      res.data.reverse().forEach((chat) => {
        history.push({
          sender: "user",
          text: chat.prompt,
        });

        history.push({
          sender: "ai",
          text: chat.response,
        });
      });

      setMessages(history);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (prompt) => {
    const userMessage = {
      sender: "user",
      text: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "",
        typing: true,
      },
    ]);

    try {
      const res = await API.post("/ai/chat", {
        prompt,
      });

      setMessages((prev) => {
        const updated = [...prev];

        updated.pop();

        updated.push({
          sender: "ai",
          text: res.data.response,
        });

        return updated;
      });
    } catch (err) {
      console.error(err);

      setMessages((prev) => {
        const updated = [...prev];

        updated.pop();

        updated.push({
          sender: "ai",
          text: "❌ Failed to get AI response.",
        });

        return updated;
      });
    }
  };

  // NEW CHAT
  const startNewChat = () => {
    setMessages([]);
  };

  // OPEN HISTORY CHAT
  const openChat = (chat) => {
    setMessages([
      {
        sender: "user",
        text: chat.prompt,
      },
      {
        sender: "ai",
        text: chat.response,
      },
    ]);
  };

  return (
    <div className="chat-page">
      <Sidebar
        onNewChat={startNewChat}
        onSelectChat={openChat}
      />

      <div className="chat-container">
        <div className="chat-header">
          <h1>🤖 DevPilot AI</h1>
          <p>Your Intelligent Coding Assistant</p>
        </div>

        <div className="chat-messages">
          <div className="messages-wrapper">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <h2>👋 Welcome to DevPilot AI</h2>

                <p>
                  Ask coding questions, generate code,
                  debug errors, explain algorithms,
                  or learn new technologies.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    sender={msg.sender}
                    text={msg.text}
                    typing={msg.typing}
                  />
                ))}

                <div ref={messagesEndRef}></div>
              </>
            )}
          </div>
        </div>

        <div className="chat-input-area">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}