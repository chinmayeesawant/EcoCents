import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import ThankYou from "./components/thankyou";
import { trackPageView } from "./utils/GoogleAnalytics";
import { trackEvent } from "./utils/GoogleAnalytics";
import ReactGA from "react-ga4";
import './App.css';


function App() {
    const [user, setUser] = useState(null);

    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize("G-RY230MPTVH");
    }, []);

    useEffect(() => {
        trackPageView(location.pathname);
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(() => {
          trackEvent("Engagement", "Spent 30s");
        }, 30000); // 30,000 ms = 30 seconds
      
        return () => clearTimeout(timer); // Cleanup if user leaves early
      }, []);

    return (
        <Routes>
            <Route path="/" element={user ? <Home user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
            <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
    );
}

export default App;

