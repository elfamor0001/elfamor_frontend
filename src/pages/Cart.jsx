import React, { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'BROWN TIGER T-SHIRT',
      price: 4495,
      size: 'XXS',
      quantity: 1,
      image: '/api/placeholder/150/150'
    }
  ]);

  const [hasGiftCard, setHasGiftCard] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const navigateToAllProducts = () =>{
    navigate("/products");
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return `RS. ${price.toLocaleString()}`;
  };

  return (
    <div className="relative min-h-screen bg-[#EFEFEF] px-4 sm:px-6 lg:px-8 py-6 sm:py-30">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
          <h1 className="text-[12px] text-gray-900 mb-4 sm:mb-0">
            YOUR CART
          </h1>
          <button onClick={navigateToAllProducts}
           className="text-[12px] text-gray-700 cursor-pointer self-start sm:self-auto">
            CONTINUE SHOPPING
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xs">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
  {/* Cart Items */}
  <div className="flex-1">
    {cartItems.map((item) => (
      <div key={item.id} className="bg-[#EFEFEF] p-2 sm:p-6">
        <div className="flex flex-row gap-3">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900 text-xs mb-2">
              {item.name}
            </h3>
            <p className="text-gray-700 text-xs mb-2">
              {formatPrice(item.price)}
            </p>
            <p className="text-gray-600 text-xs mb-4">
              SIZE: {item.size}
            </p>

            {/* Quantity Controls and Remove Button */}
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-700 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 cursor-pointer transition-colors"
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                <span className="px-4 py-2 text-xs font-medium min-w-[50px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 cursor-pointer transition-colors"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 cursor-pointer rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="font-medium text-gray-700 text-xs">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
        )}
        <div className='bg-gray-300 py-[0.5px] w-full'/>
        {/* Order Summary */}
            <div className="flex  justify-center sm:justify-end">
              <div className="bg-[#EFEFEF] p-4 sm:p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-900">ESTIMATED TOTAL</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    TAX INCLUDED. SHIPPING AND DISCOUNTS CALCULATED AT CHECKOUT.
                  </p>
                </div>

                {/* Gift Card Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasGiftCard}
                      onChange={(e) => setHasGiftCard(e.target.checked)}
                      className="mt-1 w-4 h-4 text-black bg-gray-100 cursor-pointer border-gray-700 rounded"
                    />
                    <span className="text-xs text-gray-700 leading-relaxed ">
                      HAVE A GIFT CARD?
                    </span>
                  </label>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-black text-white py-3 sm:py-4 text-xs font-medium transition-colors cursor-pointer">
                  CHECK OUT
                </button>
              </div>
            </div>
      </div>
    </div>
  );
};

export default Cart;