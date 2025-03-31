import React from "react";
import { trackEvent } from "../utils/GoogleAnalytics";

function Navbar({ user, search, setSearch, openCart, logout }) {
    return (
        <nav className="navbar">
            <h3 className="navbar-welcome">Welcome, {user.email}</h3>

            <div className="navbar-center">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (e.target.value.length > 2) {
                            trackEvent("Search", "Query", e.target.value);
                        }
                    }}
                    className="search-input"
                />
                <button onClick={openCart} className="cart-btn">🛒 Cart</button>
            </div>

            <div className="navbar-right">
                <p className="navbar-wallet">Wallet: ${user.wallet.toFixed(2)}</p>
                <button className="logout-btn" onClick={() => {trackEvent("Navigation", "Clicked Logout");logout();}}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
