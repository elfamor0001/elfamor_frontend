import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111827] py-15 px-4 sm:px-6 lg:px-24 mt-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-gray-800">Refund &amp; Return Policy</h1>
          <p className="text-xs text-gray-600 mt-2">Last updated: November 12, 2025</p>
        </div>

        {/* Policy Body */}
        <div className="bg-white p-6 rounded shadow-sm space-y-6">
          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">1. Scope</h2>
            <p className="text-xs text-gray-700 leading-6">
              This Refund &amp; Return Policy applies to purchases of perfumes made on our website
              <span className="font-medium"> elfamor.com</span> by customers in India.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">2. Returns &amp; Exchanges</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>We accept returns or exchanges only for items that are defective, damaged in transit, or incorrectly delivered.</li>
              <li>To initiate a return or exchange, you must notify us within 48 hours of receipt of the item.</li>
              <li>The item must be in its original condition, unused, with all original packaging intact.</li>
              <li>Once your return request is approved, we will provide instructions for return shipping.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">3. Refunds</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>Refunds are processed only after inspection of the returned item.</li>
              <li>If approved, the refund will be credited to the original payment method used at purchase.</li>
              <li>Shipping charges, customs, duties or any special handling fees are non-refundable.</li>
              <li>Refunds will exclude any costs incurred due to promotions (e.g., free shipping) where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">4. Non-Returnable Items</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>Items opened or used after delivery.</li>
              <li>Perfumes showing signs of use beyond opening.</li>
              <li>Items where the original packaging or seals are broken/damaged.</li>
              <li>Orders marked “Final Sale” or sold under deep discount, if so indicated at purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">5. Timeframe &amp; Processing</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>After we receive and approve the returned item, we aim to process refunds within 7–10 business days.</li>
              <li>You will receive an email notification once your refund has been initiated.</li>
              <li>Please allow additional time for your card issuer or bank to post the refund to your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">6. How to Submit a Return Request</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>
                Visit our <Link to="/contact-us" className="underline">Contact Us</Link> page or go to
                <a href="https://www.elfamor.com/contact-us" target="_blank" rel="noreferrer" className="underline ml-1">https://www.elfamor.com/contact-us</a>.
              </li>
              <li>Provide your Order Number, Date of Purchase, Product Name/Code, and a brief description of the issue (defect/damage/incorrect delivery).</li>
              <li>Our customer support team will review and respond with the return instructions.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">7. Shipping Costs for Returns</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li>If the return is due to our error (defective, damaged, or wrong item), we will reimburse return shipping costs upon approval.</li>
              <li>For other allowable returns (if any), return shipping is borne by you unless otherwise agreed.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">8. Amendments</h2>
            <p className="text-xs text-gray-700 leading-6">
              We reserve the right to amend this policy anytime. Any changes will be posted on this page with an updated “Last updated” date.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-sm text-gray-800 mb-2">9. Company Information</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-6">
              <li><strong>Brand Name:</strong> Elf Amor</li>
              <li><strong>Registered Address:</strong> GROUND FLOOR, House No. 190, Amarnagar, Ashoka Enclave Part 1, Sector 34, Faridabad, Haryana, 121003, India</li>
              <li><strong>Website:</strong> <a href="https://www.elfamor.com" target="_blank" rel="noreferrer" className="underline">https://www.elfamor.com</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}