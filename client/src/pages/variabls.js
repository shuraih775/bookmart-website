import React, { useState } from 'react';
import cartPage from './cart';
import stationeryPage from './stationery';

function controller() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const addItemToCart = ({itemName, itemPrice}) => {
    const newItem = { name: itemName, price: itemPrice };
    setCartItems([...cartItems, newItem]);
    setTotalAmount(totalAmount + itemPrice);
  };

  return (
    <div>
      <cartPage addItemToCart={addItemToCart} />
      <stationeryPage addItemToCart={addItemToCart} />
    </div>
  );
}

export default controller;
