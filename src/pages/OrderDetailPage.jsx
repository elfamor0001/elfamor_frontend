// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';

// const OrderDetailPage = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOrderDetail();
//   }, [orderId]);

//   const fetchOrderDetail = async () => {
//     try {
//       const response = await fetch(`https://elfamor.pythonanywhere.com/api/payments/orders/${orderId}/`, {
//         credentials: 'include',
//       });
      
//       if (response.ok) {
//         const orderData = await response.json();
//         setOrder(orderData);
//       } else if (response.status === 404) {
//         setError('Order not found');
//       } else {
//         setError('Failed to load order details');
//       }
//     } catch (error) {
//       console.error('Error fetching order:', error);
//       setError('Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
//       'created': { color: 'bg-blue-100 text-blue-800', text: 'Created' },
//       'attempted': { color: 'bg-yellow-100 text-yellow-800', text: 'Attempted' },
//       'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
//       'cancelled': { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
//     };
    
//     const config = statusConfig[status] || statusConfig.created;
//     return (
//       <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
//             <p className="mt-4 text-gray-600">Loading order details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <Link
//               to="/orders"
//               className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
//             >
//               Back to Orders
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <Link
//             to="/orders"
//             className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//             </svg>
//             Back to Orders
//           </Link>
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
//               <p className="text-gray-600 mt-1">Order #{order.razorpay_order_id}</p>
//             </div>
//             {getStatusBadge(order.status)}
//           </div>
//         </div>

//         {order && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Order Items & Summary */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Order Items */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold mb-4">Order Items</h2>
//                 <div className="space-y-4">
//                   {order.items.map((item) => (
//                     <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
//                       <img
//                         src={item.product.primary_image || 
//                              (item.product.images && item.product.images[0]?.image_url) || 
//                              '/src/assets/elf amor final logo.jpg'}
//                         alt={item.product.name}
//                         className="w-20 h-20 object-cover rounded"
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900">{item.product.name}</h3>
//                         <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-gray-900">
//                           {formatAmount(item.price * item.quantity)}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {formatAmount(item.price)} each
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span>{formatAmount(order.subtotal)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="text-green-600">{order.shipment_charge}</span>
//                   </div>
//                   <div className="flex justify-between text-lg font-semibold border-t pt-3">
//                     <span>Total</span>
//                     <span>{formatAmount(order.amount)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Information & Shipping */}
//             <div className="space-y-6">
//               {/* Order Information */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold mb-4">Order Information</h2>
//                 <div className="space-y-3 text-sm">
//                   <div>
//                     <span className="font-medium text-gray-600">Order ID:</span>
//                     <p className="mt-1">{order.razorpay_order_id}</p>
//                   </div>
//                   <div>
//                     <span className="font-medium text-gray-600">Order Date:</span>
//                     <p className="mt-1">{formatDate(order.created_at)}</p>
//                   </div>
//                   <div>
//                     <span className="font-medium text-gray-600">Status:</span>
//                     <p className="mt-1 capitalize">{order.status}</p>
//                   </div>
//                   {order.payment && (
//                     <div>
//                       <span className="font-medium text-gray-600">Payment ID:</span>
//                       <p className="mt-1 font-mono text-xs">{order.payment.razorpay_payment_id}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Shipping Information */}
//               {order.shipping_info && (
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
//                   <div className="space-y-2 text-sm">
//                     <div>
//                       <span className="font-medium text-gray-600">Name:</span>
//                       <p>{order.shipping_info.full_name}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">Address:</span>
//                       <p>{order.shipping_info.address}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">City:</span>
//                       <p>{order.shipping_info.city}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">State:</span>
//                       <p>{order.shipping_info.state}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">PIN Code:</span>
//                       <p>{order.shipping_info.pincode}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">Phone:</span>
//                       <p>{order.shipping_info.phone}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderDetailPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false); // Add debug state

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`https://elfamor.pythonanywhere.com/api/payments/orders/${orderId}/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const orderData = await response.json();
        console.log('Order Data from API:', orderData); // Debug log
        setOrder(orderData);
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Updated SHIPPING_STATUS to match backend tuple structure
  const SHIPPING_STATUS = [
    ['pending', 'Pending'],
    ['processing', 'Processing'],
    ['shipped', 'Shipped'],
    ['in_transit', 'In Transit'],
    ['out_for_delivery', 'Out for Delivery'],
    ['delivered', 'Delivered'],
    ['cancelled', 'Cancelled'],
    ['failed', 'Failed'],
    ['returned', 'Returned'],
  ];

  // Get status index for tracking progress - updated for tuple structure
  const getStatusIndex = (status) => {
    return SHIPPING_STATUS.findIndex(s => s[0] === status);
  };

  // Get status description helper
  const getStatusDescription = (statusKey) => {
    const descriptions = {
      'pending': 'Your order is being processed',
      'processing': 'Preparing your order for shipment',
      'shipped': 'Your order has been dispatched',
      'in_transit': 'Your order is on the way',
      'out_for_delivery': 'Your order will be delivered today',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled',
      'failed': 'Delivery attempt failed',
      'returned': 'Your order has been returned',
    };
    return descriptions[statusKey] || 'Status update';
  };

  // Get status text color
  const getStatusTextColor = (status, currentStatus) => {
    const statusIndex = getStatusIndex(status);
    const currentStatusIndex = getStatusIndex(currentStatus);
    
    if (statusIndex <= currentStatusIndex) {
      return 'text-gray-900'; // Current and completed steps
    } else {
      return 'text-gray-400'; // Future steps
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
      'created': { color: 'bg-blue-100 text-blue-800', text: 'Created' },
      'attempted': { color: 'bg-yellow-100 text-yellow-800', text: 'Attempted' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
      'cancelled': { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.created;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getShippingStatusBadge = (shippingStatus) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'Processing' },
      'shipped': { color: 'bg-purple-100 text-purple-800', text: 'Shipped' },
      'in_transit': { color: 'bg-indigo-100 text-indigo-800', text: 'In Transit' },
      'out_for_delivery': { color: 'bg-pink-100 text-pink-800', text: 'Out for Delivery' },
      'delivered': { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
      'returned': { color: 'bg-orange-100 text-orange-800', text: 'Returned' },
    };
    
    const config = statusConfig[shippingStatus] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Debug Panel */}
        {showDebug && order && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
            <p className="text-sm text-yellow-700 mb-2">
              Shipping Status exists: {order.shipping_status ? 'YES' : 'NO'}
            </p>
            {order.shipping_status && (
              <p className="text-sm text-yellow-700 mb-2">
                Shipping Status value: "{order.shipping_status}"
              </p>
            )}
            <details>
              <summary className="cursor-pointer text-sm font-medium text-yellow-800">
                View Full Order Data
              </summary>
              <pre className="text-xs bg-black text-white p-4 rounded overflow-auto mt-2">
                {JSON.stringify(order, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.razorpay_order_id}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items & Summary */}
            <div className="lg:col-span-2 space-y-6 mb-4">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.product.primary_image || 
                             (item.product.images && item.product.images[0]?.image_url) || 
                             '/src/assets/elf amor final logo.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatAmount(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatAmount(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">{order.shipment_charge}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>Total</span>
                    <span>{formatAmount(order.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Order Tracking - UPDATED */}
              {order.shipping_status ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Order Tracking</h2>
                    {getShippingStatusBadge(order.shipping_status)}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-sm font-medium ${getStatusTextColor('pending', order.shipping_status)}`}>
                        Order Placed
                      </div>
                      <div className={`text-sm font-medium ${getStatusTextColor('delivered', order.shipping_status)}`}>
                        Delivered
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: `${((getStatusIndex(order.shipping_status) + 1) / SHIPPING_STATUS.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Tracking Steps - UPDATED for tuple structure */}
                  <div className="space-y-6">
                    {SHIPPING_STATUS.slice(0, 6).map((statusTuple, index) => {
                      const statusKey = statusTuple[0];
                      const statusLabel = statusTuple[1];
                      const isActive = getStatusIndex(order.shipping_status) >= index;
                      const isCurrent = getStatusIndex(order.shipping_status) === index;
                      
                      return (
                        <div key={statusKey} className="flex items-start">
                          {/* Status Circle */}
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-green-500' : 'border-gray-300'}`}>
                              <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            </div>
                            {index < 5 && (
                              <div className={`absolute top-8 left-4 w-0.5 h-12 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                          </div>
                          
                          {/* Status Details */}
                          <div className="ml-4 pb-8">
                            <div className="flex items-center">
                              <h3 className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                {statusLabel}
                              </h3>
                              {isCurrent && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                              {getStatusDescription(statusKey)}
                            </p>
                            {isActive && order.updated_at && index === getStatusIndex(order.shipping_status) && (
                              <p className="text-xs text-gray-500 mt-2">
                                Updated on {formatDate(order.updated_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Special status handling for cancelled, failed, returned */}
                  {['cancelled', 'failed', 'returned'].includes(order.shipping_status) && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-red-700 font-medium">
                          {order.shipping_status === 'cancelled' && 'Your order has been cancelled.'}
                          {order.shipping_status === 'failed' && 'Delivery attempt failed. Please contact customer support.'}
                          {order.shipping_status === 'returned' && 'Your order has been returned to the seller.'}
                        </p>
                      </div>
                      {order.shipping_note && (
                        <p className="text-sm text-red-600 mt-2">
                          Note: {order.shipping_note}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Estimated Delivery (if available) */}
                  {order.shipping_status && ['shipped', 'in_transit', 'out_for_delivery'].includes(order.shipping_status) && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-blue-700 font-medium">
                          Estimated Delivery: Within 3-7 business days
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Show placeholder if shipping_status is not available */
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Order Tracking</h2>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Not Available
                    </span>
                  </div>
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-600">Shipping information will be available once your order is processed.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Current order status: <span className="font-medium capitalize">{order.status}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Information & Shipping */}
            <div className="space-y-6">
              {/* Order Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Information</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Order ID:</span>
                    <p className="mt-1">{order.razorpay_order_id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Order Date:</span>
                    <p className="mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <p className="mt-1 capitalize">{order.status}</p>
                  </div>
                  {order.shipping_status && (
                    <div>
                      <span className="font-medium text-gray-600">Shipping Status:</span>
                      <p className="mt-1 capitalize">{order.shipping_status.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  {order.payment && (
                    <div>
                      <span className="font-medium text-gray-600">Payment ID:</span>
                      <p className="mt-1 font-mono text-xs">{order.payment.razorpay_payment_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              {order.shipping_info && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <p>{order.shipping_info.full_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Address:</span>
                      <p>{order.shipping_info.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">City:</span>
                      <p>{order.shipping_info.city}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">State:</span>
                      <p>{order.shipping_info.state}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">PIN Code:</span>
                      <p>{order.shipping_info.pincode}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>
                      <p>{order.shipping_info.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;