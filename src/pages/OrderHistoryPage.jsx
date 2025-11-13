import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, paid, failed, cancelled
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://elfamor.pythonanywhere.com/api/payments/orders/', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
      'created': { color: 'bg-blue-100 text-blue-800', text: 'Created' },
      'attempted': { color: 'bg-yellow-100 text-yellow-800', text: 'Attempted' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
    };
    
    const config = statusConfig[status] || statusConfig.created;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFEF] pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">
            {orders.length > 0 
              ? `You have ${orders.length} order${orders.length !== 1 ? 's' : ''}`
              : 'No orders yet'
            }
          </p>
        </div>

        {/* Filter Tabs */}
        {orders.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { key: 'all', label: 'All ', count: orders.length },
                  { key: 'paid', label: 'Paid', count: orders.filter(o => o.status === 'paid').length },
                  { key: 'failed', label: 'Failed', count: orders.filter(o => o.status === 'failed').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 py-0.5 px-2 text-xs bg-gray-200 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your order history here."
                : `You don't have any ${filter} orders.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-md font-semibold text-gray-900">
                          Order #{order.razorpay_order_id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-mb font-semibold text-gray-900">
                        {formatAmount(order.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.product.primary_image || 
                               (item.product.images && item.product.images[0]?.image_url) || 
                               '/src/assets/elf amor final logo.jpg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatAmount(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatAmount(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      {order.shipping_info && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Shipping to: </span>
                          {order.shipping_info.full_name}, {order.shipping_info.city}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </Link>
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                        >
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More (if pagination is implemented) */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors mb-2"
            >
              Refresh Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const handleReorder = (order) => {
  // This would add all items from the order back to cart
  if (order.items && order.items.length > 0) {
    // Implement your add to cart logic here
    alert('Items added to cart!');
    // You might want to navigate to cart page
    // navigate('/cart');
  }
};

// CSRF token helper (you should have this already)
const getCSRFToken = async () => {
  try {
    const response = await fetch('https://elfamor.pythonanywhere.com/api/csrf/', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
};

export default OrderHistoryPage;