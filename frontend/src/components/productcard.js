import React, { useState } from "react";
import ProductModal from "./productmodal.js";
import { trackEvent } from "../utils/GoogleAnalytics";

function ProductCard({ product, addToCart }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div
                className="product-card"
                onClick={() => {
                    setShowModal(true);
                    trackEvent("Product", "Viewed Product", product.title);
                }}
            >
                <div className="product-image-container">
                    {/* <img src={`/images/${product.id}.jpg`} alt={product.title} className="product-image"/>    */}
                    <img src={"/images/default.png"} alt={product.title} className="product-image"/>   
                    {product.ecoLabel && <span className="eco-label">🌱 Eco Friendly</span>}
                </div>

                <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.shortDescription}</p>
                    <p className="product-price">£{product.price.toFixed(2)}</p>
                </div>
            </div>

            {showModal && <ProductModal product={product} addToCart={addToCart} closeModal={() => setShowModal(false)} />}
        </>
    );
}

export default ProductCard;










// import React from "react";

// function ProductCard({ product, addToCart }) {
//     return (
//         <div className="product-card">
//             <div className="product-image">
//                 <img src={`/images/${product.id}.jpg`} alt={product.title} />
//             </div>
//             <div className="product-info">
//                 <h3 className="product-title">{product.title}</h3>
//                 <p className="product-description">{product.shortDescription}</p>
//                 <p className="product-price">${product.price.toFixed(2)}</p>

//                 {product.ecoLabel && (
//                     <span className="eco-label">🌱 Eco Friendly</span>
//                 )}

//                 <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
//                     🛒 Add to Cart
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ProductCard;

