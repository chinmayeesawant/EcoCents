import React from "react";

function CategorySidebar({ category, setCategory }) {
    const categories = ["All", "Reusable Water Bottles", "Notebook & Stationery Set", "LED Desk Lamp", "Wireless Mouse & Keyboard", "Portable Phone Charger", "Backpack (Simple Design)", "Coffee Mug / Thermos", "Bluetooth Speaker", "Stainless Steel Lunchbox", "Yoga Mat", "Noise-Canceling Earplugs", "Multi-Port USB Charger", "Sustainable Towel Set"];

    return (
        <div class="sidebar">
            <h3>Categories</h3>
            {categories.map((c) => (
                <button 
                    key={c} 
                    class={`category-btn ${category === c ? "active" : ""}`} 
                    onClick={() => setCategory(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}

export default CategorySidebar;
