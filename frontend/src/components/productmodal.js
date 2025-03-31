import React from "react";
import { trackEvent } from "../utils/GoogleAnalytics";


function ProductModal({ product, addToCart, closeModal }) {
    return (
        <div className="product-modal-overlay">
            <div className="product-modal">
                <button className="modal-close-btn" onClick={closeModal}>❌</button>
                <div className="modal-content">
                    <div className="modal-image-container">
                        {/* <img src={`/images/${product.id}.jpg`} alt={product.title} className="modal-image" /> */}
                        <img src={"/images/default.png"} alt={product.title} className="modal-image" />
                        {product.ecoLabel && <span className="modal-eco-label">🌱 Eco Friendly</span>}
                    </div>

                    <div className="modal-details">
                        <h2>{product.title}</h2>
                        <p className="modal-description">{product.longDescription}</p>
                        <p className="modal-price">Price: £{product.price.toFixed(2)}</p>
                        <button className="add-to-cart-btn" onClick={() => { addToCart(product); trackEvent("Cart", "Add to Cart", product.title); closeModal(); }}>
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
