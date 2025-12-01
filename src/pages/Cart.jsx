// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCSRFToken } from '../context/authUtils.js';
// // If you use icons from lucide-react (or any other icon lib), import them:
// import { Minus, Plus, Trash2 } from 'lucide-react';

// const FALLBACK_IMAGE = '/images/fallback.png'; // change to your actual fallback path

// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [itemActionLoading, setItemActionLoading] = useState({});
//   const [hasGiftCard, setHasGiftCard] = useState(false);
//   const navigate = useNavigate();

//   // --- API calls (keep your endpoints) ---
//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/', {
//         method: 'GET',
//         credentials: 'include',
//       });
//       if (res.ok) {
//         const data = await res.json();
//         // normalize to ensure items array
//         setCart(data ?? { items: [] });
//       } else {
//         setCart({ items: [] });
//       }
//     } catch (err) {
//       console.error('fetchCart error', err);
//       setCart({ items: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateItemQuantity = async (productId, newQty) => {
//     setItemActionLoading((prev) => ({ ...prev, [productId]: true }));
//     try {
//       const csrfToken = await getCSRFToken();
//       const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/update/', {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//         },
//         body: JSON.stringify({ product_id: productId, quantity: newQty }),
//       });
//       if (res.ok) {
//         await fetchCart();
//       } else {
//         console.warn('update item failed', await res.text());
//       }
//     } catch (err) {
//       console.error('updateItemQuantity error', err);
//     } finally {
//       setItemActionLoading((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   const removeItem = async (productId) => {
//     setItemActionLoading((prev) => ({ ...prev, [productId]: true }));
//     try {
//       const csrfToken = await getCSRFToken();
//       const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/remove/', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': csrfToken,
//         },
//         body: JSON.stringify({ product_id: productId }),
//       });
//       if (res.ok) {
//         await fetchCart();
//       } else {
//         console.warn('remove item failed', await res.text());
//       }
//     } catch (err) {
//       console.error('removeItem error', err);
//     } finally {
//       setItemActionLoading((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   // --- Checkout functionality from first code ---
//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   // --- helpers used by JSX ---
//   const navigateToAllProducts = () => {
//     navigate('/products');
//   };

//   const getItemImageSrc = (item) => {
//     // Use the same image logic as first code
//     if (item?.product?.primary_image) {
//       return item.product.primary_image;
//     } else if (item?.product?.images && item.product.images[0]?.image_url) {
//       return item.product.images[0].image_url;
//     } else if (item?.image) {
//       return item.image;
//     }
//     return FALLBACK_IMAGE;
//   };

//   const formatPrice = (value) => {
//     if (value == null || Number.isNaN(Number(value))) return '₹0.00';
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value));
//   };

//   // Calculate total from cart data (using the structure from first code)
//   const calculateTotal = () => {
//     if (cart?.total) {
//       return cart.total;
//     }
    
//     // Fallback calculation if total is not provided
//     const items = cart?.items || [];
//     const total = items.reduce((acc, item) => {
//       const subtotal = Number(item?.subtotal) || 0;
//       const price = Number(item?.product?.price) || Number(item?.price) || 0;
//       const quantity = Number(item?.quantity) || 0;
      
//       return acc + (subtotal || (price * quantity));
//     }, 0);
//     return total;
//   };

//   // adapter functions used by UI buttons
//   const updateQuantity = (productId, newQty) => {
//     const qty = Math.max(0, Number(newQty));
//     if (qty === 0) {
//       removeItem(productId);
//     } else {
//       updateItemQuantity(productId, qty);
//     }
//   };

//   const removeFromCart = (productId) => {
//     removeItem(productId);
//   };

//   // Get product name with fallback
//   const getProductName = (item) => {
//     return item?.product?.name || item?.name || 'Unnamed product';
//   };

//   // Get product price with fallback
//   const getProductPrice = (item) => {
//     return Number(item?.product?.price) || Number(item?.price) || 0;
//   };

//   // Get item subtotal with fallback
//   const getItemSubtotal = (item) => {
//     if (item?.subtotal) return Number(item.subtotal);
    
//     const price = getProductPrice(item);
//     const quantity = Number(item?.quantity) || 0;
//     return price * quantity;
//   };

//   // --- render ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <p className="text-xs text-gray-600">Loading cart...</p>
//       </div>
//     );
//   }

//   const cartItems = cart?.items || [];

//   return (
//     <div className="relative min-h-screen bg-[#EFEFEF] px-3 sm:px-6 lg:px-8 py-6 sm:py-30">
//       <div className="mx-auto max-w-5xl">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
//           <h1 className="text-[12px] text-gray-900 mb-4 sm:mb-0">YOUR CART</h1>
//           <button
//             onClick={navigateToAllProducts}
//             className="text-[12px] text-gray-700 cursor-pointer self-start sm:self-auto"
//           >
//             CONTINUE SHOPPING
//           </button>
//         </div>

//         {cartItems.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-xs">Your cart is empty</p>
//             <button
//               onClick={navigateToAllProducts}
//               className="mt-4 px-4 py-2 bg-black text-white text-xs rounded"
//             >
//               SHOP NOW
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//             {/* Cart Items */}
//             <div className="flex-1 space-y-4">
//               {cartItems.map((item) => {
//                 const productId = item?.product?.id || item?.id;
//                 const price = getProductPrice(item);
//                 const qty = Number(item?.quantity) || 0;
//                 const itemTotal = getItemSubtotal(item);
//                 const imgSrc = getItemImageSrc(item);
//                 const isLoading = Boolean(itemActionLoading[productId]);

//                 return (
//                   <div key={item?.id ?? Math.random()} className="bg-[#EFEFEF] p-2 sm:p-6 border rounded">
//                     <div className="flex flex-row gap-2 items-center">
//                       <div className="flex-shrink-0">
//                         <img
//                           src={imgSrc}
//                           alt={getProductName(item)}
//                           className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg"
//                           onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
//                         />
//                       </div>

//                       <div className="flex-1 text-left">
//                         <h3 className="font-medium text-gray-900 text-xs mb-1">{getProductName(item)}</h3>
//                         <p className="text-gray-700 text-xs mb-1">{formatPrice(price)}</p>
//                         <p className="text-gray-600 text-xs mb-2">SIZE: {item?.size ?? '-'}</p>

//                         <div className="flex items-center gap-4">
//                           <div className="flex items-center border border-gray-700 rounded-lg">
//                             <button
//                               onClick={() => updateQuantity(productId, Math.max(0, qty - 1))}
//                               className="p-2 cursor-pointer"
//                               disabled={isLoading}
//                               aria-label="decrease quantity"
//                             >
//                               <Minus size={16} className="text-gray-600" />
//                             </button>
//                             <span className="px-4 py-2 text-xs font-medium min-w-[50px] text-center">{qty}</span>
//                             <button
//                               onClick={() => updateQuantity(productId, qty + 1)}
//                               className="p-2 cursor-pointer"
//                               disabled={isLoading}
//                               aria-label="increase quantity"
//                             >
//                               <Plus size={16} className="text-gray-600" />
//                             </button>
//                           </div>

//                           <button
//                             onClick={() => removeFromCart(productId)}
//                             className="p-2"
//                             disabled={isLoading}
//                             aria-label="remove item"
//                           >
//                             <Trash2 size={18} className="text-gray-600" />
//                           </button>
                          
//                           {/* Loading indicator from first code */}
//                           {isLoading && (
//                             <span className="ml-2 text-xs text-gray-400">...</span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="-ml-12">
//                         <p className="font-medium text-gray-700 text-xs">
//                           {formatPrice(itemTotal)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Summary - Enhanced with checkout functionality */}
//             <div className="w-full max-w-sm">
//               <div className="bg-[#EFEFEF] p-4 sm:p-6 border rounded">
//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between items-center text-xs">
//                     <span className="font-medium text-gray-900">ESTIMATED TOTAL</span>
//                     <span className="font-medium text-gray-900">{formatPrice(calculateTotal())}</span>
//                   </div>

//                   <p className="text-xs text-gray-600 leading-relaxed">TAX INCLUDED. SHIPPING AND DISCOUNTS CALCULATED AT CHECKOUT.</p>
//                 </div>

//                 <div className="mb-4">
//                   <label className="flex items-start gap-3 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={hasGiftCard}
//                       onChange={(e) => setHasGiftCard(e.target.checked)}
//                       className="mt-1 w-4 h-4 text-black bg-gray-100 cursor-pointer border-gray-700 rounded"
//                     />
//                     <span className="text-xs text-gray-700 leading-relaxed">HAVE A GIFT CARD?</span>
//                   </label>
//                 </div>

//                 {/* Checkout button from first code with enhanced styling */}
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-black text-white px-6 py-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
//                 >
//                   CHECK OUT
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React, { useEffect, useState } from 'react';
// import { calculateShipping } from '../context/cartUtils';
import CartSummary from '../components/CartSummary';
import { useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../context/authUtils.js';
// If you use icons from lucide-react (or any other icon lib), import them:
import { Minus, Plus, Trash2 } from 'lucide-react';

const FALLBACK_IMAGE = '/images/fallback.png'; // change to your actual fallback path

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemActionLoading, setItemActionLoading] = useState({});
  const [hasGiftCard, setHasGiftCard] = useState(false);
  const navigate = useNavigate();

  // --- API calls (keep your endpoints) ---
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        // normalize to ensure items array
        setCart(data ?? { items: [] });
      } else {
        setCart({ items: [] });
      }
    } catch (err) {
      console.error('fetchCart error', err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateItemQuantity = async (productId, newQty) => {
    setItemActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const csrfToken = await getCSRFToken();
      const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/update/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ product_id: productId, quantity: newQty }),
      });
      if (res.ok) {
        await fetchCart();
      } else {
        console.warn('update item failed', await res.text());
      }
    } catch (err) {
      console.error('updateItemQuantity error', err);
    } finally {
      setItemActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    setItemActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const csrfToken = await getCSRFToken();
      const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/remove/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) {
        await fetchCart();
      } else {
        console.warn('remove item failed', await res.text());
      }
    } catch (err) {
      console.error('removeItem error', err);
    } finally {
      setItemActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // --- Checkout functionality from first code ---
  const handleCheckout = () => {
    // Check if any item is out of stock before proceeding to checkout
    const cartItems = cart?.items || [];
    const outOfStockItems = cartItems.filter(item => {
      const productStock = item?.product?.stock || 0;
      const currentQuantity = Number(item?.quantity) || 0;
      return productStock < currentQuantity;
    });

    if (outOfStockItems.length > 0) {
      alert('Some items in your cart are out of stock. Please update your cart before proceeding to checkout.');
      return;
    }

    navigate('/checkout');
  };

  // --- helpers used by JSX ---
  const navigateToAllProducts = () => {
    navigate('/products');
  };

  const getItemImageSrc = (item) => {
    // Use the same image logic as first code
    if (item?.product?.primary_image) {
      return item.product.primary_image;
    } else if (item?.product?.images && item.product.images[0]?.image_url) {
      return item.product.images[0].image_url;
    } else if (item?.image) {
      return item.image;
    }
    return FALLBACK_IMAGE;
  };

  const formatPrice = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '₹0.00';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value));
  };

  // Calculate total from cart data using discounted prices when available
  const calculateTotal = () => {
    const items = cart?.items || [];
    const total = items.reduce((acc, item) => {
      const product = item?.product;
      const regularPrice = Number(product?.price) || Number(item?.price) || 0;
      const discountedPrice = Number(product?.discounted_price);
      const effectivePrice = discountedPrice && discountedPrice < regularPrice ? discountedPrice : regularPrice;
      const quantity = Number(item?.quantity) || 0;
      
      return acc + (effectivePrice * quantity);
    }, 0);
    return total;
  };

  // Get available stock for an item
  const getAvailableStock = (item) => {
    return item?.product?.stock || 0;
  };

  // Check if item is out of stock
  const isItemOutOfStock = (item) => {
    const stock = getAvailableStock(item);
    return stock === 0;
  };

  // Check if item has low stock
  const hasLowStock = (item) => {
    const stock = getAvailableStock(item);
    const quantity = Number(item?.quantity) || 0;
    return stock > 0 && stock <= quantity;
  };

  // Get stock status message
  const getStockStatus = (item) => {
    const stock = getAvailableStock(item);
    const quantity = Number(item?.quantity) || 0;
    
    if (stock === 0) {
      return 'Out of stock';
    } else if (quantity > stock) {
      return `Only ${stock} available`;
    } else if (stock <= 5) {
      return `Low stock (${stock} left)`;
    }
    return null;
  };

  // adapter functions used by UI buttons
  const updateQuantity = (productId, newQty, availableStock) => {
    const qty = Math.max(0, Number(newQty));
    
    // Don't allow increasing beyond available stock
    if (qty > availableStock) {
      alert(`Only ${availableStock} items available in stock`);
      return;
    }
    
    if (qty === 0) {
      removeItem(productId);
    } else {
      updateItemQuantity(productId, qty);
    }
  };

  const removeFromCart = (productId) => {
    removeItem(productId);
  };

  // Get product name with fallback
  const getProductName = (item) => {
    return item?.product?.name || item?.name || 'Unnamed product';
  };

  // Get product price with fallback (use discounted_price if available and less than price)
  const getProductPrice = (item) => {
    const product = item?.product;
    const regularPrice = Number(product?.price) || Number(item?.price) || 0;
    const discountedPrice = Number(product?.discounted_price);
    
    if (discountedPrice && discountedPrice < regularPrice) {
      return discountedPrice;
    }
    return regularPrice;
  };

  // Get item subtotal with fallback
  const getItemSubtotal = (item) => {
    // if (item?.subtotal) return Number(item.subtotal);
    
    const price = getProductPrice(item);
    const quantity = Number(item?.quantity) || 0;
    return price * quantity;
  };

  // Check if checkout should be disabled
  const isCheckoutDisabled = () => {
    const cartItems = cart?.items || [];
    return cartItems.length === 0 || cartItems.some(item => {
      const productStock = item?.product?.stock || 0;
      const currentQuantity = Number(item?.quantity) || 0;
      return productStock < currentQuantity;
    });
  };

  // --- render ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-xs text-gray-600">Loading cart...</p>
      </div>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <div className="relative min-h-screen bg-[#EFEFEF] px-3 sm:px-6 lg:px-8 py-6 sm:py-20 lg:py-6 mt-21 lg:mt-21">
      <div className="">
        {/* Header */}
        <div className="flex flex-row sm:flex-row sm:items-center justify-between mb-6 sm:mb-10">
          <h1 className="text-[12px] text-gray-900 sm:mb-0">YOUR CART</h1>
          <button
            onClick={navigateToAllProducts}
            className="text-[12px] text-gray-700 cursor-pointer self-end sm:self-auto"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xs">Your cart is empty</p>
            <button
              onClick={navigateToAllProducts}
              className="mt-4 px-4 py-2 bg-black text-white text-xs rounded"
            >
              SHOP NOW
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => {
                const productId = item?.product?.id || item?.id;
                const price = getProductPrice(item);
                const qty = Number(item?.quantity) || 0;
                const itemTotal = getItemSubtotal(item);
                const imgSrc = getItemImageSrc(item);
                const isLoading = Boolean(itemActionLoading[productId]);
                const availableStock = getAvailableStock(item);
                const outOfStock = isItemOutOfStock(item);
                const lowStock = hasLowStock(item);
                const stockStatus = getStockStatus(item);

                return (
                  <div key={item?.id ?? Math.random()} className={`bg-[#EFEFEF] p-2 sm:p-4 border rounded ${outOfStock ? 'border-red-300 bg-red-50' : ''}`}>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={imgSrc}
                          alt={getProductName(item)}
                          className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 text-xs mb-1">{getProductName(item)}</h3>
                        {item?.product?.discounted_price && item.product.discounted_price < item.product.price ? (
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-gray-500 text-xs line-through">{formatPrice(item.product.price)}</p>
                            <p className="text-red-600 text-xs font-bold">{formatPrice(price)}</p>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-xs mb-1">{formatPrice(price)}</p>
                        )}
                        <p className="text-gray-600 text-xs mb-2">SIZE: {item.product?.volume_ml ?? '-'} ml</p>

                        {/* Stock Status Display */}
                        {stockStatus && (
                          <p className={`text-xs mb-2 ${
                            outOfStock ? 'text-red-600 font-medium' : 
                            lowStock ? 'text-amber-600' : 'text-gray-600'
                          }`}>
                            {stockStatus}
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          <div className={`flex items-center border rounded-lg ${
                            outOfStock ? 'border-red-300' : 'border-gray-700'
                          }`}>
                            <button
                              onClick={() => updateQuantity(productId, Math.max(0, qty - 1), availableStock)}
                              className={`p-2 ${outOfStock ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                              disabled={isLoading || outOfStock}
                              aria-label="decrease quantity"
                            >
                              <Minus size={16} className={outOfStock ? 'text-gray-400' : 'text-gray-600'} />
                            </button>
                            <span className={`px-4 py-2 text-xs font-medium min-w-[50px] text-center ${
                              outOfStock ? 'text-red-600' : ''
                            }`}>
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(productId, qty + 1, availableStock)}
                              className={`p-2 ${
                                outOfStock || qty >= availableStock ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'
                              }`}
                              disabled={isLoading || outOfStock || qty >= availableStock}
                              aria-label="increase quantity"
                            >
                              <Plus size={16} className={outOfStock || qty >= availableStock ? 'text-gray-400' : 'text-gray-600'} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(productId)}
                            className="p-2"
                            disabled={isLoading}
                            aria-label="remove item"
                          >
                            <Trash2 size={18} className="text-gray-600" />
                          </button>
                          
                          {/* Loading indicator from first code */}
                          {isLoading && (
                            <span className="ml-2 text-xs text-gray-400">...</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-12">
                        <p className={`font-medium text-xs ${
                          outOfStock ? 'text-red-600 line-through' : 'text-gray-700'
                        }`}>
                          {formatPrice(itemTotal)}
                        </p>
                        {outOfStock && (
                          <p className="text-red-600 text-xs mt-1">Remove item</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary - Enhanced with checkout functionality */}
            <div className="w-full max-w-sm">
              <div className="bg-[#EFEFEF] p-4 sm:p-6 border rounded">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-900">ESTIMATED TOTAL</span>
                    <span className="font-medium text-gray-900">{formatPrice(calculateTotal())}</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">TAX INCLUDED. SHIPPING AND DISCOUNTS CALCULATED AT CHECKOUT.</p>
                  
                  {/* Out of stock warning */}
                  {cartItems.some(item => {
                    const productStock = item?.product?.stock || 0;
                    const currentQuantity = Number(item?.quantity) || 0;
                    return productStock < currentQuantity;
                  }) && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-700 text-xs font-medium">
                        ⚠️ Some items in your cart exceed available stock. Please update quantities before checkout.
                      </p>
                    </div>
                  )}
                </div>

                {/* Checkout button from first code with enhanced styling */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled()}
                  className={`w-full px-6 py-3 rounded text-xs font-medium transition-colors duration-300 cursor-pointer ${
                    isCheckoutDisabled() 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isCheckoutDisabled() ? 'UNAVAILABLE ITEMS IN CART' : 'CHECK OUT'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;