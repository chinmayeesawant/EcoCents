import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("https://ecocents.onrender.com/login", { email, password });
            setUser(response.data); // Store user data in state
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div style={{
            maxWidth: "400px", margin: "50px auto", padding: "20px", textAlign: "center",
            border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
        }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button
                onClick={handleLogin}
                style={{
                    width: "100%", padding: "10px", background: "#ff9800",
                    border: "none", color: "white", cursor: "pointer", borderRadius: "5px"
                }}>
                Login
            </button>
        </div>
    );
}

export default Login;
