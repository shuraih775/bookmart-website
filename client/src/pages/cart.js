import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function CartPage() {
  const navigate = useNavigate();
  // State to hold cart items and total amount
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to retrieve cart items from sessionStorage
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    // Calculate total amount
    const total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, []);

  // Function to handle checkout button click
 // Function to handle checkout button click
 const handleCheckout = async () => {
  try {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const formData = new FormData();

    // Add order items to formData
    cart.forEach((item, index) => {
      console.log(item.price);
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][price]`, item.price);
    });

    // Calculate total amount
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    formData.append('totalAmount', total);

    const token = JSON.parse(sessionStorage.getItem('token'));
    if(token==null){
      navigate('/login');
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    // Make POST request to API
    await axios.post('http://localhost:5000/api/orders', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 201) { 
        console.log("order succesful");
      } else if (response.status === 401) {
        navigate('/login');
      }
    }).catch((error) => {
      console.error('Error:', error);
     
    });
    // Clear cart after successful checkout
    sessionStorage.removeItem('cart');
    setCartItems([]);
    setTotalAmount(0); // Reset total amount
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};


  return (
    <main>
      <section id="cart-items">
        {/* Cart items retrieved from sessionStorage */}
        
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <span>Name: {item.name}</span>
            <span>Quantity: {item.quantity}</span>
            <span>Price: Rs {item.price}</span>
          </div>
        ))}
      </section>

      <div id="cart-total">
        <p>Total: <span>Rs {totalAmount}</span></p>
      </div>

      <button id="checkout-btn" onClick={handleCheckout}>Checkout</button>
    </main>
  );
}

export default CartPage;
