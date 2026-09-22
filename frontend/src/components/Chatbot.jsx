import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../services/api";
import "../styles/Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  //Autmatically brings cursor to the the chat input box after the response is generated
  useEffect(() => {
    if (!loading) {
        inputRef.current?.focus();
    }
    }, [loading]);

  const typeMessage = async (text) => {
    let currentText = "";

    for (const character of text) {
        currentText += character;

        setMessages((prev) => {
        const updated = [...prev];

        const lastMessage = updated.length - 1;

        if (updated[lastMessage]?.role === "assistant") {
            updated[lastMessage] = {
            ...updated[lastMessage],
            content: currentText,
            };
        }

        return updated;
        });

        await new Promise((resolve) => setTimeout(resolve, 15));
    }
    };

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) return;

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        content: msg.content,
        }));

        const response = await api.post("/ai/chat", {
        message: trimmedInput,
        history,
        });

      const reply = response.data.reply;

      // Add an empty assistant message first
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      // Type the response
      await typeMessage(reply);
    } catch (error) {
      console.error("AI Chat Error:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.detail ||
            `Request failed (${error.response?.status || "unknown error"}).`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends the message
    // Shift + Enter creates a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chatbot-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3>AI Wellness Assistant</h3>
              <span>Here to listen and help</span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="welcome-icon">🌱</div>

                <h4>Hi! I'm here for you.</h4>

                <p>
                  You can talk to me about how you're feeling, your day,
                  stress, or anything that's on your mind.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="chat-message assistant-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows="1"
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;