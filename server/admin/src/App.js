import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import HomePage from './pages/HomePage';
import PrintoutPage from './pages/printout';
import OrdersPage from './pages/orders';
import StationeryPage from './pages/stationery';


const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/stationery" element={<StationeryPage/>} />
          <Route path="/printout" element={<PrintoutPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
