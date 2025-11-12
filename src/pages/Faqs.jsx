import React, { useState } from "react";

const FAQ_DATA = {
  PRODUCT: [
    { q: "WHAT IS MY RIGHT SIZE?", a: "We provide a full size chart on each product page. If in doubt, size up or email support with your measurements." },
    { q: "WHAT ARE THE CARE INSTRUCTIONS ON THE T-SHIRTS?", a: "Machine wash cold, do not bleach, hang dry, warm iron on reverse. Avoid tumble drying to preserve print." },
    { q: "HOW DO OUR NEW DROPS WORK?", a: "New drops are limited edition releases that will be announced via email and on the site. Checkout fast to secure stock." },
    { q: "WHAT IS A PRE-ORDER?", a: "Pre-orders let you reserve items before production completes. Dispatch dates are shown on the product page." },
  ],
  DELIVERY: [
    { q: "HOW LONG DOES SHIPPING TAKE?", a: "Standard shipping typically takes 3-7 working days depending on your location." },
    { q: "DO YOU OFFER EXPRESS SHIPPING?", a: "Yes, express shipping is available at checkout for eligible pin codes." },
  ],
  ORDER: [
    { q: "CAN I CANCEL MY ORDER?", a: "Orders can only be cancelled before dispatch. Contact support immediately to request cancellation." },
    { q: "HOW DO I TRACK MY ORDER?", a: "You will receive a tracking link by email once the order is shipped. Use that to track your package." },
  ],
  "ORDER RECEIVED": [
    { q: "WHAT HAPPENS AFTER I PLACE AN ORDER?", a: "We confirm your order via email and start the fulfillment process. Shipping details follow on dispatch." },
  ],
  EXCHANGES: [
    { q: "WHAT IS YOUR EXCHANGE POLICY?", a: "We accept exchanges within 7 days from delivery. Products must be unworn, unwashed and tags attached." },
    { q: "HOW DO I RAISE AN EXCHANGE REQUEST?", a: "Go to Orders > Select order > Request exchange, or email ordersupport@yourstore.com" },
  ],
  "GENERAL FAQS": [
    { q: "DO YOU HAVE STORES?", a: "Yes — check our store locator for addresses and opening hours." },
    { q: "HOW CAN I CONTACT SUPPORT?", a: "Email ordersupport@yourstore.com or use the contact form on the site." },
  ],
};

const TAB_ORDER = ["PRODUCT", "DELIVERY", "ORDER", "ORDER RECEIVED", "EXCHANGES", "GENERAL FAQS"];

export default function FAQs() {
  const [activeTab, setActiveTab] = useState("PRODUCT");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = FAQ_DATA[activeTab] || [];

  function toggleAccordion(i) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <div className="min-h-screen bg-[#efefef] pb-24 mt-21">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Page Title */}
        <h1 className="text-center text-sm tracking-widest text-gray-700 mb-8">FAQ'S</h1>

        {/* Tabs */}
        <div className="flex justify-center">
          <div
            className="
              flex gap-4 items-center px-2 sm:px-0 
              overflow-x-auto no-scrollbar
              w-full max-w-full sm:w-auto
            "
          >
            {TAB_ORDER.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenIndex(null);
                  }}
                  className={`
                    flex-shrink-0 whitespace-nowrap px-6 py-4 font-semibold tracking-wide text-sm uppercase transition-all cursor-pointer
                    ${isActive
                      ? "bg-white text-black border border-gray-800 shadow-sm"
                      : "bg-black text-white"}
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="mt-8 max-w-4xl mx-auto">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-gray-300 last:border-b-0">
                <button
                  onClick={() => toggleAccordion(i)}
                  aria-expanded={isOpen}
                  className="w-full text-left py-6 flex items-center justify-between focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-medium tracking-wide text-gray-800">
                    {item.q}
                  </span>

                  <span
                    className={`ml-4 w-6 h-6 flex items-center justify-center text-gray-700 transform transition-transform duration-200
                      ${isOpen ? "rotate-45" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    {/* plus icon rotates into X when open */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                {/* Answer Section */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 sm:max-h-60 py-2" : "max-h-0 py-0"
                  }`}
                >
                  <p className="text-sm text-gray-600 px-1 sm:px-2 leading-7">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}

          {/* If no FAQs */}
          {faqs.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No FAQs available for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
