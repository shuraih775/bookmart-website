import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StationeryPage() {
  const [ordersByUser, setOrdersByUser] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]); 

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/retriever/${statusFilter}`);
      const orders = response.data.orders;
      setOrdersByUser(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const markAsComplete = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/markAsComplete/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error marking order as complete:', error);
    }
  };

  const markAsReadyToPick = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/markAsReady/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error marking order as ready to pick:', error);
    }
  };

  const renderOrders = (orders) => {
    return orders.map(order => (
      <div key={order._id} className="product-card">
        <h2>{order.username}</h2>
        {order.order_items.map(ord => (
          <div key={ord._id} className='product-card'> 
            <p>Name: {ord.name}</p>
            <p>Price: {ord.price}</p>
            <p>Quantity: {ord.quantity}</p>
          </div>
        ))}
        {console.log(order)}
        
        <p>{new Date(order.order_date).toLocaleString()}</p>
        <p>Total Amount: {order.bill_amt}</p>
        {statusFilter === 'readytopick' ? (
          <button onClick={() => markAsComplete(order._id)}>Mark as Complete</button>
        ) : statusFilter === 'pending' ? (
          <button onClick={() => markAsReadyToPick(order._id)}>Mark as Ready to pick</button>
        ) : null}
      </div>
    ));
  };

  return (
    <section className="product-list">
      <div className='orders'>
        <div><button onClick={() => setStatusFilter('pending')}>Pending </button></div>
        <div><button onClick={() => setStatusFilter('readytopick')}>Ready to Pick</button></div>
        <div><button onClick={() => setStatusFilter('complete')}>Previous</button></div>
      </div>
      {statusFilter === 'pending' && renderOrders(ordersByUser.filter(order => order.status === 'pending'))}
      {statusFilter === 'complete' && renderOrders(ordersByUser.filter(order => order.status === 'complete'))}
      {statusFilter === 'readytopick' && renderOrders(ordersByUser.filter(order => order.status === 'readytopick'))}
    </section>
  );
}

export default StationeryPage;
