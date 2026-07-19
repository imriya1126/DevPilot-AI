import { useRef } from "react";
import { FiPaperclip } from "react-icons/fi";
import "../styles/FileUpload.css";

export default function FileUpload({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <button
        className="upload-btn"
        onClick={handleClick}
        title="Upload File"
      >
        <FiPaperclip size={18} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".py,.java,.cpp,.c,.js,.ts,.html,.css,.txt,.pdf"
        onChange={handleChange}
      />
    </>
  );
}