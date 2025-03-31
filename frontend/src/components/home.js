import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import ProductList from "./productlist";
import CartModal from "./cartmodal";
import CategorySidebar from "./categorysidebar";
import Login from "./login";
import { trackEvent } from "../utils/GoogleAnalytics";

function Home({ user, setUser }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Relevance");
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();

    // Load cart from user data on login
    useEffect(() => {
        if (user?.cart) {
            try {
                const parsed = JSON.parse(user.cart.replace(/""/g, '"')); // Unescape quotes
                if (Array.isArray(parsed)) {
                    setCart(parsed);
                }
            } catch (e) {
                console.error("❌ Failed to parse user.cart:", user.cart, e);
            }
        }
    }, [user]);

    // Save cart to backend whenever it changes
    useEffect(() => {
        if (!user?.email || !Array.isArray(cart)) return;

        const saveCart = async () => {
            try {
                await axios.post("http://localhost:5001/update-cart", {
                    email: user.email,
                    cart,
                });
            } catch (error) {
                console.error("❌ Failed to save cart:", error);
            }
        };

        saveCart();
    }, [cart, user]);

    // Add item to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, count: item.count + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, count: 1 }];
            }
        });
    };

    // Update item quantity
    const updateCart = (productId, change) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId
                        ? { ...item, count: Math.max(item.count + change, 0) }
                        : item
                )
                .filter((item) => item.count > 0)
        );
    };

    // Checkout
    const checkout = async () => {
        const totalPrice = cart.reduce(
            (total, item) => total + item.price * item.count,
            0
        );

        if (user.wallet < totalPrice) {
            alert("Insufficient wallet balance.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/checkout", {
                email: user.email,
                cart,
                totalPrice,
            });

            setUser({ ...user, wallet: parseFloat(response.data.wallet), cart: "" });
            setCart([]);
            trackEvent("Checkout", "Complete Purchase");
            navigate("/thank-you");
        } catch (error) {
            console.error("Checkout failed:", error);
            trackEvent("Checkout", "Failure", error.response?.data?.message || "Unknown error");
            alert(error.response?.data?.message || "Checkout failed.");
        }
    };

    const logout = () => {
        setUser(null);
        navigate("/");
    };

    if (!user) {
        return <Login setUser={setUser} />;
    }

    return (
        <div className="app">
            <Navbar
                search={search}
                setSearch={setSearch}
                openCart={() => setShowCart(true)}
                user={user}
                logout={logout}
            />
            <div className="main-content">
                <CategorySidebar category={category} setCategory={setCategory} />
                <div className="sort-options">
                    <label>Sort by:</label>
                    <select onChange={(e) => setSortBy(e.target.value)}>
                        <option>Relevance</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
                <ProductList
                    search={search}
                    category={category}
                    sortBy={sortBy}
                    addToCart={addToCart}
                />
            </div>
            {showCart && (
                <CartModal
                    cart={cart}
                    updateCart={updateCart}
                    closeCart={() => setShowCart(false)}
                    checkout={checkout}
                />
            )}
        </div>
    );
}

export default Home;
