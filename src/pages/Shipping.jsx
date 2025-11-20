import { Link } from "react-router-dom";

const shippingText = [
  `Purchases are shipped from our warehouse in Faridabad, Haryana – India, by courier. Please allow following number of days from receipt of your order.`,

  `India Wide – 3 to 7 business days`,

  `Order deliveries will be made between 9am – 8pm Monday – Saturday. Goods will need to be signed for upon delivery. If you cannot be there to sign for your delivery please suggest an alternative i.e. a family member, colleague, neighbor, etc.`,

  `Elf Amor takes no responsibility for goods signed by an alternative person.`,

  `Elf Amor is not responsible for damage after delivery.`,

  `All claims for shortages or damages must be reported to customer service on the day of delivery along with the video evidencing the opening the shipment until the product is found damaged/ defective/incorrect. Shipping and handling rates may vary based on product, packaging, size, volume, type and other considerations. The shipping and handling charges are given at the time of check out and consumers will know about this before making payments.`,
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111827] py-15 px-4 sm:px-6 lg:px-24 mt-12">
      <div className="mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-sm tracking-widest text-gray-600">SHIPPING POLICY</h1>
          <p className="text-xs text-gray-600 mt-2">
  Last updated: {new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}
</p>
        </div>

        {/* Body */}
        <div className="">
          <div className="mb-6 space-y-4">
            {shippingText.map((p, i) => (
              <p key={i} className="text-xs sm:text-sm text-gray-700 leading-6">
                {p}
              </p>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xs sm:text-sm text-gray-700">
              <strong>IMPORTANT:</strong> Shipping terms are subject to change. Always check the latest policy on the website.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
