import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Route, Routes } from 'react-router-dom';
import AllProducts from './pages/AllProducts.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import FAQs from './pages/Faqs.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Terms from './pages/Terms.jsx';
import Shipping from './pages/Shipping.jsx';
import AboutUs from './pages/AboutUs.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {/* Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/products' element={<AllProducts/>} />
        <Route path='/productdetails/:id' element={<ProductDetails/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/refund-policy' element={<RefundPolicy/>} />
        <Route path='/faqs' element={<FAQs/>} />
        <Route path='/auth' element={<AuthPage/>} />
        <Route path='/contact-us' element={<ContactUs/>} />
        <Route path='/orders' element={<OrderHistoryPage/>} />
        <Route path='/terms' element={<Terms/>} />
        <Route path='/shipping' element={<Shipping/>} />
        <Route path='/about' element={<AboutUs/>} />
        <Route path='/order-success' element={<OrderSuccessPage/>} />
        <Route path='/checkout' element={<CheckoutPage/>} />
        <Route path='/orders/:orderId' element={<OrderDetailPage/>} />
      </Routes>
      
      {/* Footer */}
      <Footer />

      
    </>
  );
};

export default App;