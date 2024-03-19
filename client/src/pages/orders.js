import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token'));
      const response = await axios.get('http://localhost:5000/api/orders/retrieve', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h1>All Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <h3>Order Date: {new Date(order.order_date).toLocaleString()}</h3>
              <p>Username: {order.username}</p>
              
              <ul>
                {order.order_items.map((item, idx) => (
                  <li key={idx}>
                    <p>Name: {item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs {item.price}</p>
                  </li>
                ))}
              </ul>
              <p>Bill Amount: Rs {order.bill_amt}</p>
              <p>Status:{order.status=='pending'? 'processing': order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Order;
