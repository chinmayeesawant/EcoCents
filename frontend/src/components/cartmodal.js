import React, { useEffect, useState } from "react";
import axios from "axios";

function CartModal({ cart, updateCart, closeCart, checkout }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://ecocents.onrender.com/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Get full product info for each cart item
    const getProductDetails = (id) => {
        return products.find((p) => p.id === id);
    };

    const totalPrice = cart.reduce((total, item) => {
        const product = getProductDetails(item.id);
        const price = product?.price || 0;
        return total + price * item.count;
    }, 0);

    return (
        <div className="cart-modal">
            <button className="close-btn" onClick={closeCart}>❌ Close</button>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cart.map((item) => {
                    const product = getProductDetails(item.id);
                    return (
                        <div key={item.id} className="cart-item">
                            <h4>{product?.title || item.id}</h4>
                            <p>${(product?.price || 0).toFixed(2)}</p>
                            <div className="cart-quantity">
                                <button onClick={() => updateCart(item.id, -1)}>-</button>
                                <span>{item.count}</span>
                                <button onClick={() => updateCart(item.id, 1)}>+</button>
                            </div>
                        </div>
                    );
                })
            )}
            <div className="cart-total">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
            </div>
            {cart.length > 0 && <button className="checkout-btn" onClick={checkout}>Checkout</button>}
        </div>
    );
}

export default CartModal;




// old code:
// import React from "react";

// function CartModal({ cart, updateCart, closeCart, checkout }) {
    
//     const totalPrice = cart.reduce((total, item) => total + item.price * item.count, 0);

//     return (
//         <div className="cart-modal">
//             <button className="close-btn" onClick={closeCart}>❌ Close</button>
//             <h2>Your Cart</h2>
//             {cart.length === 0 ? (
//                 <p>Your cart is empty.</p>
//             ) : (
//                 cart.map((item) => (
//                     <div key={item.id} className="cart-item">
//                         <h4>{item.title}</h4>
//                         <p>${item.price.toFixed(2)}</p>
//                         <div className="cart-quantity">
//                             <button onClick={() => updateCart(item.id, -1)}>-</button>
//                             <span>{item.count}</span>
//                             <button onClick={() => updateCart(item.id, 1)}>+</button>
//                         </div>
//                     </div>
//                 ))
//             )}
//             <div className="cart-total">
//                 <h3>Total: ${totalPrice.toFixed(2)}</h3>
//             </div>
//             {cart.length > 0 && <button className="checkout-btn" onClick={checkout}>Checkout</button>}
//         </div>
//     );
// }

// export default CartModal;
