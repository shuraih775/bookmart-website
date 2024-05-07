import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token'));
      if (!token) {
        setLoading(false);
        setLoggedin(false);
      } else {
        setLoggedin(true);
        const response = await axios.get('http://localhost:5000/api/orders/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedOrders = response.data.orders.reverse(); 
        setOrders(sortedOrders);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="orders-container">
      <h1>All Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : !loggedin ? (
        <p>Please login to view orders.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="order">
              <div className="order-details">
                <h3>Order Date: {new Date(order.order_date).toLocaleString()}</h3>
                <p className="order-status">Status: {order.status === 'pending' ? 'processing...' : order.status==='readytopick'? 'Ready to pick':order.status}</p>
                
                {expandedOrderId === order._id && expandedOrders[order._id] && (
                  <div>
                    <ul className="order-items">
                    <div className='order-items-desc'>
                            <div>Name</div>
                            <div>Price</div>
                            <div>Units</div>
                            <div>Total</div>
                          </div>
                      {order.order_items.map((item, idx) => (
                        
                  
                        <li key={idx} className="order-item">
                          <div>{item.name}</div>
                          <div>Rs. {item.price}</div>
                          <div>{item.quantity}</div>
                          <div>Rs. {item.price * item.quantity}</div>
                        </li>
                        
                      ))}
                    </ul>
                    <p><b><i>Bill Amount :</i></b>{'\u00A0\u00A0\u00A0'} Rs. {order.bill_amt}</p>
                    
                  </div>
                )}
                <button className='btn-1' onClick={() => toggleOrderDetails(order._id)}>
                  {expandedOrderId === order._id && expandedOrders[order._id] ? 'Less' : 'More...'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Order;
