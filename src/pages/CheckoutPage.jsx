// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loadRazorpay } from '../context/razorpayUtils.js';
// import { getCSRFToken } from '../context/authUtils.js';
// import { useAuth } from '../context/AuthContext.jsx';

// const CheckoutPage = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [calculatingShipping, setCalculatingShipping] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     full_name: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     phone: ''
//   });
//   const [shippingData, setShippingData] = useState({
//     shipmentCharge: 0,
//     shippingCourier: '',
//     estimatedDays: ''
//   });

//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // Shipping calculation function
//   const calculateShipping = async (pincode, cartItems) => {
//     try {
//       const csrfToken = await getCSRFToken();
//       const response = await fetch('https://api.elfamor.com/api/payments/calculate-shipping/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           pincode: pincode,
//           items: cartItems
//         }),
//       });

//       if (response.ok) {
//         return await response.json();
//       } else {
//         throw new Error('Failed to calculate shipping');
//       }
//     } catch (error) {
//       console.error('Shipping calculation error:', error);
//       throw error;
//     }
//   };

//   // Calculate cart totals with shipping
//   const getCartTotals = (cartItems) => {
//     const subtotal = cartItems.reduce((acc, item) => {
//       const price = item.product.discounted_price && item.product.discounted_price < item.product.price 
//         ? item.product.discounted_price 
//         : item.product.price;
//       return acc + (price * item.quantity);
//     }, 0);
    
//     // Always use dynamic shipping data
//     const shipmentCharge = shippingData.shipmentCharge || 0;
//     const total = subtotal + shipmentCharge;

//     return {
//       subtotal,
//       shipmentCharge,
//       total,
//       shippingCourier: shippingData.shippingCourier,
//       estimatedDays: shippingData.estimatedDays
//     };
//   };

//   // Calculate shipping when pincode changes
//   useEffect(() => {
//     const pincode = shippingInfo.pincode;
    
//     if (pincode && pincode.length === 6 && cart?.items) {
//       const timer = setTimeout(async () => {
//         try {
//           setCalculatingShipping(true);
//           const shippingResult = await calculateShipping(pincode, cart.items);
          
//           if (shippingResult.success) {
//             setShippingData({
//               shipmentCharge: shippingResult.shipping_charge,
//               shippingCourier: shippingResult.courier,
//               estimatedDays: shippingResult.estimated_days
//             });
//           } else {
//             // Show error to user
//             alert(`Unable to calculate shipping: ${shippingResult.error}`);
//             setShippingData({
//               shipmentCharge: 0,
//               shippingCourier: 'Service unavailable',
//               estimatedDays: 'N/A'
//             });
//           }
//         } catch (error) {
//           console.error('Error calculating shipping:', error);
//           alert('Error calculating shipping charges. Please try again.');
//           setShippingData({
//             shipmentCharge: 0,
//             shippingCourier: 'Error',
//             estimatedDays: 'N/A'
//           });
//         } finally {
//           setCalculatingShipping(false);
//         }
//       }, 500); // Debounce for 500ms

//       return () => clearTimeout(timer);
//     }
//   }, [shippingInfo.pincode, cart?.items]);

//   // Wrap fetchCart in useCallback to prevent unnecessary recreations
//   const fetchCart = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://api.elfamor.com/api/cart/', {
//         method: 'GET',
//         credentials: 'include',
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setCart(data);
//       } else {
//         navigate('/cart');
//       }
//     } catch {
//       navigate('/cart');
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchCart();
//     if (user) {
//       setShippingInfo(prev => ({
//         ...prev,
//         full_name: user.full_name || '',
//         phone: user.phone || ''
//       }));
//     }
//   }, [user, fetchCart]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const createOrder = async () => {
//     try {
//       const cartTotals = getCartTotals(cart.items);
//       const csrfToken = await getCSRFToken();
//       const response = await fetch('https://api.elfamor.com/api/payments/create-order/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           items: cart.items.map(item => ({
//             product_id: item.product.id,
//             quantity: item.quantity,
//           })),
//           shipping_info: shippingInfo,
//           subtotal: cartTotals.subtotal,
//           shipment_charge: cartTotals.shipmentCharge,
//           total_amount: cartTotals.total
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create order');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   };

//   const verifyPayment = async (paymentData) => {
//     try {
//       const csrfToken = await getCSRFToken();
//       const response = await fetch('https://api.elfamor.com/api/payments/verify-payment/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//         },
//         credentials: 'include',
//         body: JSON.stringify(paymentData),
//       });

//       if (!response.ok) {
//         throw new Error('Verification failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       throw error;
//     }
//   };

//   const handlePayment = async () => {
//     if (!shippingInfo.full_name || !shippingInfo.address || !shippingInfo.city || 
//         !shippingInfo.state || !shippingInfo.pincode || !shippingInfo.phone) {
//       alert('Please fill all shipping information');
//       return;
//     }

//     if (shippingInfo.pincode.length !== 6) {
//       alert('Please enter a valid 6-digit PIN code');
//       return;
//     }

//     if (shippingData.shipmentCharge === 0 && shippingData.shippingCourier === 'Service unavailable') {
//       alert('Unable to calculate shipping charges for this pincode. Please try a different pincode or contact support.');
//       return;
//     }

//     setProcessing(true);

//     try {
//       // Step 1 & 2: Create order
//       const orderData = await createOrder();

//       // Step 3 & 4: Load Razorpay and open checkout
//       const razorpayLoaded = await loadRazorpay();
//       if (!razorpayLoaded) {
//         throw new Error('Razorpay SDK failed to load');
//       }

//       const options = {
//         key: orderData.key,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: 'Perfume Store',
//         description: 'Purchase from Perfume Store',
//         order_id: orderData.order_id,
//         handler: async function (response) {
//           try {
//             const verification = await verifyPayment({
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             });

//             if (verification.success) {
//               navigate('/order-success', { 
//                 state: { 
//                   orderId: verification.order_id,
//                   paymentId: verification.payment_id 
//                 }
//               });
//             } else {
//               alert('Payment verification failed. Please contact support.');
//               setProcessing(false);
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             alert('Payment verification failed. Please contact support.');
//             setProcessing(false);
//           }
//         },
//         prefill: {
//           name: shippingInfo.full_name,
//           email: user?.email || '',
//           contact: shippingInfo.phone,
//         },
//         notes: {
//           shipping_address: JSON.stringify(shippingInfo)
//         },
//         theme: {
//           color: '#000000',
//         },
//         modal: {
//           ondismiss: function() {
//             setProcessing(false);
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
      
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert(`Payment failed: ${error.message}`);
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center py-8">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!cart || !cart.items || cart.items.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   const cartTotals = getCartTotals(cart.items);

//   return (
//     <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
//         {/* Shipping Calculation Status */}
//         {calculatingShipping && (
//           <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
//             <div className="flex items-center">
//               <span className="mr-2">⏳</span>
//               <span>Calculating shipping charges...</span>
//             </div>
//           </div>
//         )}

//         {/* Shipping Information */}
//         {shippingData.shippingCourier && !calculatingShipping && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
//             <div className="flex items-center justify-between">
//               <span>
//                 Shipping via <strong>{shippingData.shippingCourier}</strong>
//                 {shippingData.estimatedDays && ` • Est. ${shippingData.estimatedDays} days`}
//               </span>
//               <span className="font-semibold">
//                 ₹{shippingData.shipmentCharge.toFixed(2)}
//               </span>
//             </div>
//           </div>
//         )}
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Shipping Information Form */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="full_name"
//                   value={shippingInfo.full_name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address *
//                 </label>
//                 <textarea
//                   name="address"
//                   value={shippingInfo.address}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                   required
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City *
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={shippingInfo.city}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     State *
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={shippingInfo.state}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     PIN Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={shippingInfo.pincode}
//                     onChange={handleInputChange}
//                     maxLength="6"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     required
//                     placeholder="6-digit PIN"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={shippingInfo.phone}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
//             <div className="space-y-4 mb-6">
//               {cart.items.map((item) => (
//                 <div key={item.id} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={item.product.primary_image || (item.product.images && item.product.images[0]?.image_url) || 'src/assets/elf amor final logo.jpg'}
//                       alt={item.product.name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div>
//                       <div className="font-medium text-sm">{item.product.name}</div>
//                       <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
//                     </div>
//                   </div>
//                   <div>
//                     {item.product.discounted_price && item.product.discounted_price < item.product.price ? (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs text-gray-500 line-through">₹{(item.product.price * item.quantity).toFixed(2)}</span>
//                         <span className="font-semibold text-red-600">₹{(item.product.discounted_price * item.quantity).toFixed(2)}</span>
//                       </div>
//                     ) : (
//                       <div className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="border-t pt-4 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Subtotal</span>
//                 <span>₹{cartTotals.subtotal.toFixed(2)}</span>
//               </div>
              
//               <div className="flex justify-between text-sm">
//                 <span>Shipping</span>
//                 <span>₹{cartTotals.shipmentCharge.toFixed(2)}</span>
//               </div>
              
//               <div className="flex justify-between text-lg font-semibold border-t pt-2">
//                 <span>Total</span>
//                 <span>₹{cartTotals.total.toFixed(2)}</span>
//               </div>
//             </div>
            
//             <button
//               onClick={handlePayment}
//               disabled={processing || calculatingShipping || !shippingInfo.pincode || shippingInfo.pincode.length !== 6 || shippingData.shipmentCharge === 0}
//               className="w-full bg-black text-white py-3 rounded-md font-semibold mt-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
//             >
//               {processing ? 'Processing...' : 
//                calculatingShipping ? 'Calculating Shipping...' :
//                !shippingInfo.pincode ? 'Enter PIN Code' :
//                shippingInfo.pincode.length !== 6 ? 'Invalid PIN Code' :
//                shippingData.shipmentCharge === 0 ? 'Calculate Shipping First' :
//                `Pay ₹${cartTotals.total.toFixed(2)}`}
//             </button>
            
//             <div className="text-xs text-gray-500 mt-4 text-center">
//               Secure payment powered by Razorpay
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRazorpay } from '../context/razorpayUtils.js';
import { getCSRFToken } from '../context/authUtils.js';
import { useAuth } from '../context/AuthContext.jsx';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [shippingData, setShippingData] = useState({
    shipmentCharge: 0,
    shippingCourier: '',
    estimatedDays: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  // Shipping calculation function
  const calculateShipping = async (pincode, cartItems) => {
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch('https://api.elfamor.com/api/payments/calculate-shipping/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          pincode: pincode,
          items: cartItems
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to calculate shipping');
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      throw error;
    }
  };

const getCartTotals = (cartItems) => {
  if (!Array.isArray(cartItems)) return { subtotal: 0, shipmentCharge: 0, total: 0 };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item?.product;
    if (!product) return acc;

    const price = Number(
      product.discounted_price && Number(product.discounted_price) < Number(product.price)
        ? product.discounted_price
        : product.price
    ) || 0;

    return acc + price * (item.quantity || 0);
  }, 0);

  const shipmentCharge = Number(shippingData.shipmentCharge) || 0;
  const total = subtotal + shipmentCharge;

  return {
    subtotal,
    shipmentCharge,
    total,
    shippingCourier: shippingData.shippingCourier,
    estimatedDays: shippingData.estimatedDays
  };
};


  // Calculate shipping when pincode changes
  useEffect(() => {
    const pincode = shippingInfo.pincode;
    
    if (pincode && pincode.length === 6 && cart?.items) {
      const timer = setTimeout(async () => {
        try {
          setCalculatingShipping(true);
          const shippingResult = await calculateShipping(pincode, cart.items);
          
          if (shippingResult.success) {
            setShippingData({
              shipmentCharge: shippingResult.shipping_charge,
              shippingCourier: shippingResult.courier,
              estimatedDays: shippingResult.estimated_days
            });
          } else {
            // Show error to user
            alert(`Unable to calculate shipping: ${shippingResult.error}`);
            setShippingData({
              shipmentCharge: 0,
              shippingCourier: 'Service unavailable',
              estimatedDays: 'N/A'
            });
          }
        } catch (error) {
          console.error('Error calculating shipping:', error);
          alert('Error calculating shipping charges. Please try again.');
          setShippingData({
            shipmentCharge: 0,
            shippingCourier: 'Error',
            estimatedDays: 'N/A'
          });
        } finally {
          setCalculatingShipping(false);
        }
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timer);
    }
  }, [shippingInfo.pincode, cart?.items]);

  // Wrap fetchCart in useCallback to prevent unnecessary recreations
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.elfamor.com/api/cart/', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        navigate('/cart');
      }
    } catch {
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        full_name: user.full_name || '',
        phone: user.phone || ''
      }));
    }
  }, [user, fetchCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = async () => {
    try {
      const cartTotals = getCartTotals(cart?.items || []);

      const csrfToken = await getCSRFToken();
      const response = await fetch('https://api.elfamor.com/api/payments/create-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          shipping_info: shippingInfo,
          subtotal: cartTotals.subtotal,
          shipment_charge: cartTotals.shipmentCharge,
          total_amount: cartTotals.total
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch('https://api.elfamor.com/api/payments/verify-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!shippingInfo.full_name || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.pincode || !shippingInfo.phone) {
      alert('Please fill all shipping information');
      return;
    }

    if (shippingInfo.pincode.length !== 6) {
      alert('Please enter a valid 6-digit PIN code');
      return;
    }

    if (shippingData.shipmentCharge === 0 && shippingData.shippingCourier === 'Service unavailable') {
      alert('Unable to calculate shipping charges for this pincode. Please try a different pincode or contact support.');
      return;
    }

    setProcessing(true);

    try {
      // Step 1 & 2: Create order
      const orderData = await createOrder();

      // Step 3 & 4: Load Razorpay and open checkout
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Perfume Store',
        description: 'Purchase from Perfume Store',
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verification = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              navigate('/order-success', { 
                state: { 
                  orderId: verification.order_id,
                  paymentId: verification.payment_id 
                }
              });
            } else {
              alert('Payment verification failed. Please contact support.');
              setProcessing(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: shippingInfo.full_name,
          email: user?.email || '',
          contact: shippingInfo.phone,
        },
        notes: {
          shipping_address: JSON.stringify(shippingInfo)
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const cartTotals = getCartTotals(cart.items);

  return (
    <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {/* Shipping Calculation Status */}
        {calculatingShipping && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <span className="mr-2">⏳</span>
              <span>Calculating shipping charges...</span>
            </div>
          </div>
        )}

        {/* Shipping Information */}
        {shippingData.shippingCourier && !calculatingShipping && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span>
                Shipping via <strong>{shippingData.shippingCourier}</strong>
                {shippingData.estimatedDays && ` • Est. ${shippingData.estimatedDays} days`}
              </span>
              <span className="font-semibold">
                ₹{shippingData.shipmentCharge.toFixed(2)}
              </span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={shippingInfo.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    maxLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    placeholder="6-digit PIN"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
            {cart.items.map((item) => {
  const p = item.product || {};
  const price = Number(p.price) || 0;
  const discounted = Number(p.discounted_price) || 0;

  const finalPrice = discounted > 0 && discounted < price ? discounted : price;

  return (
    <div key={item.id} className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={p.primary_image || (p.images?.[0]?.image_url) || 'src/assets/elf amor final logo.jpg'}
          alt={p.name || "Product"}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <div className="font-medium text-sm">{p.name || "Product"}</div>
          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
        </div>
      </div>

      <div>
        {discounted > 0 && discounted < price ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 line-through">₹{(price * item.quantity).toFixed(2)}</span>
            <span className="font-semibold text-red-600">₹{(discounted * item.quantity).toFixed(2)}</span>
          </div>
        ) : (
          <div className="font-semibold">₹{(price * item.quantity).toFixed(2)}</div>
        )}
      </div>
    </div>
  );
})}

            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cartTotals.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>₹{cartTotals.shipmentCharge.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{cartTotals.total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={processing || calculatingShipping || !shippingInfo.pincode || shippingInfo.pincode.length !== 6 || shippingData.shipmentCharge === 0}
              className="w-full bg-black text-white py-3 rounded-md font-semibold mt-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {processing ? 'Processing...' : 
               calculatingShipping ? 'Calculating Shipping...' :
               !shippingInfo.pincode ? 'Enter PIN Code' :
               shippingInfo.pincode.length !== 6 ? 'Invalid PIN Code' :
               shippingData.shipmentCharge === 0 ? 'Calculate Shipping First' :
               `Pay ₹${cartTotals.total.toFixed(2)}`}
            </button>
            
            <div className="text-xs text-gray-500 mt-4 text-center">
              Secure payment powered by Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;