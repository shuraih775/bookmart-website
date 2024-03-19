const Order = require('../models/orders');
const { getUsername } = require('./getusername.js');

const orderController = {
  createOrder: async (req, res) => {
    try {
      console.log(req.body);
      const orderItems = req.body.items;
      const billAmount = req.body.totalAmount;
      console.log(billAmount);
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const tokenArray = authHeader.split(' ');
      const token = tokenArray[1];
      if (!token) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const username = await getUsername(token);
      if (!username) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      
      const newOrder = new Order({
        username,
        order_items: orderItems,
        bill_amt: billAmount
      });

      
      await newOrder.save();

      
      res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, message: 'Failed to create order' });
    }
  },
  
  retrieve: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const tokenArray = authHeader.split(' ');
      const token = tokenArray[1];
      if (!token) {
        return res.status(401).json({ message: 'User not logged in' });
      }

      const username = await getUsername(token);
      if (!username) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      
      const orders = await Order.find({ username });

      
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
    }
  },
  retrieveAll: async (req, res) => {
    try {
      const status = req.params.status;
  

      const orders = await Order.find({ status });
  
      console.log(orders);
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
    }
  },
  markasreadytopick: async (req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndUpdate(orderId, {
        status: 'readytopick'
    });
    if (order) {
      res.status(200).json({ message: 'Order marked as ready to pick' });
  } else {
      res.status(404).json({ message: 'Order not found' });
  }
},
mark: async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findByIdAndUpdate(orderId, {
      status: 'complete'
  });
  if (order) {
    res.status(200).json({ message: 'Order marked as ready to pick' });
} else {
    res.status(404).json({ message: 'Order not found' });
}
}

  
};

module.exports = orderController;
