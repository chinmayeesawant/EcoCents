import React from "react";

function CartModal({ cart, updateCart, closeCart, checkout }) {
    
    const totalPrice = cart.reduce((total, item) => total + item.price * item.count, 0);

    return (
        <div className="cart-modal">
            <button className="close-btn" onClick={closeCart}>❌ Close</button>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="cart-item">
                        <h4>{item.title}</h4>
                        <p>${item.price.toFixed(2)}</p>
                        <div className="cart-quantity">
                            <button onClick={() => updateCart(item.id, -1)}>-</button>
                            <span>{item.count}</span>
                            <button onClick={() => updateCart(item.id, 1)}>+</button>
                        </div>
                    </div>
                ))
            )}
            <div className="cart-total">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
            </div>
            {cart.length > 0 && <button className="checkout-btn" onClick={checkout}>Checkout</button>}
        </div>
    );
}

export default CartModal;
