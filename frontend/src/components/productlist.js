import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./productcard";


function ProductList({ search, category, sortBy, addToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Number of products per page

    useEffect(() => {
        axios.get("https://ecocents.onrender.com/products").then((res) => {
            setProducts(res.data);
            setFilteredProducts(res.data); // Show all products initially
        });
    }, []);

    useEffect(() => {
        let filtered = products
            .filter((p) => category === "All" || p.category === category)
            .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

        if (sortBy === "Price: Low to High") {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High to Low") {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to page 1 when filter changes
    }, [search, category, sortBy, products]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="product-list-container">
            <div className="product-list">
                {currentItems.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    currentItems.map((p) => <ProductCard key={p.id} product={p} addToCart={addToCart} />)
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button className="pagination-btn" onClick={prevPage} disabled={currentPage === 1}>
                    ◀ Previous
                </button>
                <span> Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)} </span>
                <button className="pagination-btn" onClick={nextPage} disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}>
                    Next ▶
                </button>
            </div>
        </div>
    );
}

export default ProductList;