import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import api from "../services/api";
import "../styles/auth.css";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log("✅ Registered:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      setError("Registration failed. Try again.");
    }
  };

  const fields = [
    { label: "Name", type: "text", name: "name", value: name, onChange: (e) => setName(e.target.value) },
    { label: "Email", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value) },
    { label: "Password", type: "password", name: "password", value: password, onChange: (e) => setPassword(e.target.value) },
  ];

  return (
    <>
      <AuthForm
        title="Register"
        fields={fields}
        buttonText="Register"
        onSubmit={handleSubmit}
        footer={
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        }
      />
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
    </>
  );
}

export default Register;
