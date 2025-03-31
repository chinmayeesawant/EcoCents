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
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to right, #fef9f4, #fff3e0)"
        }}>
            <div style={{
                maxWidth: "400px",
                width: "100%",
                padding: "30px",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
            }}>
                <h1 style={{ marginBottom: "10px", color: "#ff9800" }}>🌿 EcoCents 🌿</h1>
                {/* <p style={{ marginBottom: "20px", color: "#555" }}>Login to manage your sustainable savings</p> */}

                {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "90%",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "90%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#ff9800",
                        border: "none",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        borderRadius: "6px",
                        transition: "background 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#fb8c00"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#ff9800"}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
