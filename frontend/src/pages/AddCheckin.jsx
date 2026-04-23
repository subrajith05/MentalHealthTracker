import React, { useState } from "react";
import "../styles/AddCheckin.css";
import { useNavigate } from "react-router-dom";
import CheckinForm from "../components/CheckinForm";
import api from "../services/api";

function AddCheckin() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post(
        "/checkin/add",
        { mood, note },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Check-in added successfully!");
        setTimeout(() => navigate("/dashboard"), 1200);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.detail || "Something went wrong";
      setMessage(`❌ ${errMsg}`);
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