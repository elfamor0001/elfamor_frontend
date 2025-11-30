import React from 'react';

export default function ShippingBanner({ freeShippingEligible, amountNeeded }) {
  return (
    <div className={`rounded p-2 mb-4 text-center
      ${freeShippingEligible ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
      {freeShippingEligible
        ? "🎉 FREE shipping eligible!"
        : <>Add <span className="font-bold">₹{amountNeeded}</span> more for <span className="font-bold">FREE shipping!</span></>
      }
    </div>
  );
}