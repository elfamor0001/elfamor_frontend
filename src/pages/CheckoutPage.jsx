import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRazorpay } from '../context/razorpayUtils';
import { getCSRFToken } from '../context/authUtils';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wrap fetchCart in useCallback to prevent unnecessary recreations
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/', {
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
  }, [navigate]); // Add navigate as dependency since it's used inside

  useEffect(() => {
    fetchCart();
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        full_name: user.full_name || '',
        phone: user.phone || ''
      }));
    }
  }, [user, fetchCart]); // Now include fetchCart in dependencies

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const createOrder = async () => {
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch('https://elfamor.pythonanywhere.com/api/payments/create-order/', {
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
          shipping_info: shippingInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
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
      const response = await fetch('https://elfamor.pythonanywhere.com/api/payments/verify-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

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
          // Step 6: Handle payment response
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
      alert('Payment failed. Please try again.');
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

  return (
    <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
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
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.primary_image || (item.product.images && item.product.images[0]?.image_url) || 'src/assets/elf amor final logo.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-sm">{item.product.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold">₹{item.subtotal}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cart.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{cart.total}</span>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-black text-white py-3 rounded-md font-semibold mt-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {processing ? 'Processing...' : `Pay ₹${cart.total}`}
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