import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get orderId from location state or from localStorage (for payment recovery)
  const { orderId: stateOrderId, paymentId } = location.state || {};
  const storedOrderId = localStorage.getItem('pending_order_id');
  const orderId = stateOrderId || storedOrderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    fetchOrderDetails();
    
    // Clear any pending order from localStorage
    if (storedOrderId) {
      localStorage.removeItem('pending_order_id');
    }
  }, [orderId, navigate, storedOrderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`https://elfamor.pythonanywhere.com/api/payments/orders/${orderId}/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
          </div>

          {order && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{order.razorpay_order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium">₹{order.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600 capitalize">{order.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                {order.shipping_info && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name: </span>
                        {order.shipping_info.full_name}
                      </div>
                      <div>
                        <span className="font-medium">Address: </span>
                        {order.shipping_info.address}
                      </div>
                      <div>
                        <span className="font-medium">City: </span>
                        {order.shipping_info.city}
                      </div>
                      <div>
                        <span className="font-medium">State: </span>
                        {order.shipping_info.state}
                      </div>
                      <div>
                        <span className="font-medium">PIN Code: </span>
                        {order.shipping_info.pincode}
                      </div>
                      <div>
                        <span className="font-medium">Phone: </span>
                        {order.shipping_info.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.primary_image || 
                               (item.product.images && item.product.images[0]?.image_url) || 
                               '/src/assets/elf amor final logo.jpg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  
                  {/* Order Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{order.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>₹{order.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t">
            <Link
              to="/orders"
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors duration-300 text-center"
            >
              View All Orders
            </Link>
            <Link
              to="/products"
              className="border border-black text-black px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors duration-300 text-center"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            You will receive an email confirmation shortly. 
            For any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;