import React from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
    const navigate = useNavigate();

    return (
        <div className="thank-you">
            <h1>🎉 Thank You for Shopping with Us! 🎉</h1>
            <p>Your order has been placed successfully.</p>
            <button className="return-home" onClick={() => navigate("/")}>Return to Home</button>
        </div>
    );
}

export default ThankYou;
