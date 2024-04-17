import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from './popup';
import { Link } from "react-router-dom";
import axios from "axios";

function CartPage() {
  const handleClosePopup = (doredirect) => {
    setShowPopup(false);
    if (doredirect) {
      navigate('/login');
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [doRedirect, setDoRedirect] = useState(false);
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, []);

  const handleCheckout = async () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const formData = new FormData();

    
    cart.forEach((item, index) => {
      console.log(item.price);
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][price]`, item.price);
    });


    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    formData.append('totalAmount', total);

    const token = JSON.parse(sessionStorage.getItem('token'));
    if(token==null){
      setMsg('Login to place orders.\n Redirecting to Login Page... ');
      setStatus(false);
      setDoRedirect(true);
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    await axios.post('https://bookmart-website.onrender.com/api/orders', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      if (response.status === 201) { 
        setMsg("Order Succesfully Placed.")
        setStatus(true);
        setDoRedirect(false);
        setShowPopup(true);
      } else if (response.status === 401) {
        setMsg("Please login to order.")
        setStatus(false);
        setDoRedirect(true);
        setShowPopup(true);
        
      
      } else if (response.status === 500) {
        setMsg("Server error. Please try again later.");
        setStatus(false);
        setShowPopup(true);
      }
    }).catch((error) => {
      setMsg("Server error. Please try again later.");
      setStatus(false);
      setDoRedirect(false);
      setShowPopup(true);
     
    });
    
    sessionStorage.removeItem('cart');
    setCartItems([]);
    setTotalAmount(0); 
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

  const handleQuantityChange = (index, type) => {
    const updatedCartItems = [...cartItems];
    if (type === 'increment') {
      updatedCartItems[index].quantity++;
    } else if (type === 'decrement' && updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity--;
    }
    else if (type === 'decrement' && updatedCartItems[index].quantity === 1) {
      updatedCartItems.splice(index, 1);
    }
    setCartItems(updatedCartItems);
    sessionStorage.setItem('cart', JSON.stringify(updatedCartItems));
    const total = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  };
 
  

  return (
    <main>
      <section id="cart-items">
        {cartItems.length > 0 ?(
          <>
        <div className='cart-items-desc'>
          <div >Name</div>
          <div >Price</div>
          <div >Quantity</div>
          <div >Total</div>
        </div>
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div>{item.name}</div>
            <div>Rs. {item.price}</div>
            <div>
              
              {item.quantity}{'\u00A0\u00A0'} 
              <button className='quantitize-btn' onClick={() => handleQuantityChange(index, 'increment')}>+</button>
              <button className='quantitize-btn' onClick={() => handleQuantityChange(index, 'decrement')}>-</button>
            </div>
            <div>Rs. {item.price * item.quantity}</div>
            
          </div>
        ))}
        <div id="cart-total">
          <p>Bill Amount: <span>Rs {totalAmount}</span></p>
        </div>
        </>
        ):(
          <>
          <p>No items in the Cart.</p>
          <Link className=" btn-1" to="/stationery">Go to Stationery</Link>
          </>
        )}
      </section>
      
      {cartItems.length > 0 && (
        <button id="checkout-btn" className='btn-1' onClick={handleCheckout}>Checkout</button>
      )}
      
      {showPopup && (
        <Popup
          message={msg}
          onClose={handleClosePopup}
          status={status}
          doRedirect={doRedirect}
        />
      )}
    </main>
  );
}

export default CartPage;
