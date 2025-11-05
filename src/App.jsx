import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import AllProducts from './pages/AllProducts';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {/* Navbar */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <Routes>
        <Route path='/' element={<Home/>} />
        {/* <Route path='/products' element={<AllProducts/>} />
        <Route path='/productdetails' element={<ProductDetails/>} />
        <Route path='/cart' element={<Cart/>} /> */}
      </Routes>
      
      {/* Footer */}
      <Footer />

      
    </>
  );
};

export default App;