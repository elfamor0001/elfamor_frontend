// import React, { useState } from 'react';
// import Navbar from './components/Navbar.jsx';
// import Footer from './components/Footer.jsx';
// import { Route, Routes } from 'react-router-dom';
// import AllProducts from './pages/AllProducts.jsx';
// import Home from './pages/Home.jsx';
// import ProductDetails from './pages/ProductDetails.jsx';
// import Cart from './pages/Cart.jsx';
// import RefundPolicy from './pages/RefundPolicy.jsx';
// import AuthPage from './pages/AuthPage.jsx';
// import ContactUs from './pages/ContactUs.jsx';
// import Terms from './pages/Terms.jsx';
// import Shipping from './pages/Shipping.jsx';
// import AboutUs from './pages/AboutUs.jsx';
// import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
// import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
// import CheckoutPage from './pages/CheckoutPage.jsx';
// import OrderDetailPage from './pages/OrderDetailPage.jsx';
// import ScrollToTop from './components/ScrollToTop.js';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('home');

//   return (
//     <>
//       <ScrollToTop />
//       <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

//       <Routes>
//         <Route path='/' element={<Home/>} />
//         <Route path='/products' element={<AllProducts/>} />
//         <Route path='/productdetails/:id' element={<ProductDetails/>} />

//         {/* Cart is public so guest can add/view */}
//         <Route path='/cart' element={<Cart />} />

//         {/* Protected Routes */}
//         <Route path='/orders' element={
//           <ProtectedRoute>
//             <OrderHistoryPage />
//           </ProtectedRoute>
//         }/>
//         <Route path='/checkout' element={
//           <ProtectedRoute>
//             <CheckoutPage />
//           </ProtectedRoute>
//         }/>
//         <Route path='/orders/:orderId' element={
//           <ProtectedRoute>
//             <OrderDetailPage />
//           </ProtectedRoute>
//         }/>
//         <Route path='/order-success' element={
//           <ProtectedRoute>
//             <OrderSuccessPage />
//           </ProtectedRoute>
//         }/>

//         {/* Public Routes */}
//         <Route path='/refund-policy' element={<RefundPolicy/>} />
//         <Route path='/auth' element={<AuthPage/>} />
//         <Route path='/contact-us' element={<ContactUs/>} />
//         <Route path='/terms' element={<Terms/>} />
//         <Route path='/shipping-policy' element={<Shipping/>} />
//         <Route path='/about' element={<AboutUs/>} />
//         <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
//       </Routes>

//       <Footer />
//     </>
//   );
// };

// export default App;


import React from "react";
import UnderMaintenance from "./components/UnderMaintenance.jsx";

const App = () => {
  return <UnderMaintenance />;
};

export default App;