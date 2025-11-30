import React from 'react';
import ShippingBanner from './ShippingBanner';

export default function CartSummary({ subtotal, shipmentCharge, total, freeShippingEligible, amountNeeded }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <ShippingBanner freeShippingEligible={freeShippingEligible} amountNeeded={amountNeeded} />
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span className={freeShippingEligible ? "text-green-600 font-bold" : "text-blue-600"}>
          {freeShippingEligible ? "FREE" : `₹${shipmentCharge}`}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}