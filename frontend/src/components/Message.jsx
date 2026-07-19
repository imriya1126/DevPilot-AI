import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/Message.css";

export default function Message({ sender, text, typing }) {
  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  if (typing) {
    return (
      <div className={`message-row ${sender}`}>
        <div className={`avatar ${sender}-avatar`}>
          🤖
        </div>

        <div className={`message ${sender}-message typing-message`}>
          <span>DevPilot AI is typing</span>

          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`message-row ${sender}`}>
      <div className={`avatar ${sender}-avatar`}>
        {sender === "ai" ? "🤖" : "👤"}
      </div>

      <div className={`message ${sender}-message`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>

        {sender === "ai" && (
          <button
            className="copy-btn"
            onClick={copyText}
          >
            📋 Copy
          </button>
        )}
      </div>
    </div>
  );
}