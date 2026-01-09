// src/pages/AddCheckin.jsx
import React, { useState } from "react";
import "../styles/AddCheckin.css";
import { useNavigate } from "react-router-dom";
import CheckinForm from "../components/CheckinForm";

function AddCheckin() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/checkin/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mood, note }),
      });

      if (res.ok) {
        setMessage("✅ Check-in added successfully!");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        const errData = await res.json();
        setMessage(`❌ ${errData.detail || "Something went wrong"}`);
      }
    } catch (error) {
      setMessage("⚠️ Server connection failed");
    }
  };

  return (
    <CheckinForm
      mood={mood}
      note={note}
      setMood={setMood}
      setNote={setNote}
      message={message}
      onSubmit={handleSubmit}
    />
  );
}

export default AddCheckin;
