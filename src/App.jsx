import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import AllProducts from './pages/AllProducts';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import RefundPolicy from './pages/RefundPolicy';
import FAQs from './pages/Faqs';
import AuthPage from './pages/AuthPage';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import Shipping from './pages/Shipping';
import AboutUs from './pages/AboutUs';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CheckoutPage from './pages/CheckoutPage';

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
      </Routes>
      
      {/* Footer */}
      <Footer />

      
    </>
  );
};

export default App;