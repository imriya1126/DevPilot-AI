import { useState, useRef } from "react";
import {
  FiSend,
  FiPaperclip,
  FiMic,
  FiMicOff,
} from "react-icons/fi";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { uploadFile } from "../services/upload";
import "../styles/ChatInput.css";

export default function ChatInput({ onSend }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const fileInputRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSend = async () => {
    const text = transcript || prompt;

    if (!text.trim() || loading) return;

    setLoading(true);

    await onSend(text);

    setPrompt("");
    resetTranscript();

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const res = await uploadFile(file);

      setUploadMessage(
        `📄 ${res.filename} uploaded (${res.characters} characters)`
      );

      setTimeout(() => {
        setUploadMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);

      setUploadMessage("❌ File upload failed.");

      setTimeout(() => {
        setUploadMessage("");
      }, 3000);
    }

    e.target.value = "";
  };

  const startListening = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setPrompt(transcript);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser doesn't support Speech Recognition.</p>;
  }

  return (
    <>
      {uploadMessage && (
        <div className="upload-status">
          {uploadMessage}
        </div>
      )}

      <div className="chat-input-container">

        <button
          className="attach-btn"
          onClick={() => fileInputRef.current.click()}
        >
          <FiPaperclip />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".pdf,.txt,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
        />

        <input
          className="chat-input"
          type="text"
          placeholder="Ask DevPilot AI anything..."
          value={transcript || prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          className="attach-btn"
          onClick={listening ? stopListening : startListening}
        >
          {listening ? <FiMicOff /> : <FiMic />}
        </button>

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : <FiSend />}
        </button>

      </div>
    </>
  );
}