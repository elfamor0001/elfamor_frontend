import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111827] py-12 px-4 sm:px-6 lg:px-24 mt-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-gray-800">Terms &amp; Conditions</h1>
          <p className="text-xs text-gray-600 mt-2">Last updated: November 12, 2025</p>
        </div>

        <div className="bg-white p-6 rounded shadow-sm">
          <p className="text-xs text-gray-700 leading-7 mb-4">
            Welcome to <strong>Elf Amor</strong> ("we", "our", "us"). These Terms and Conditions ("Terms") govern your
            access to and use of our website — <span className="font-medium">www.elfamor.com</span> (the "Site") — and the
            purchase of our products. By accessing or using the Site, you agree to be bound by these Terms. If you do not
            agree, please discontinue use immediately.
          </p>

          <hr className="my-4" />

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">1. General Information</h2>
            <p className="text-xs text-gray-700 leading-7">
              Elf Amor is an Indian e-commerce brand offering premium perfumes and fragrances. By using our website, you
              agree to comply with all applicable laws and these Terms.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">2. Eligibility</h2>
            <p className="text-xs text-gray-700 leading-7">
              You must be at least 18 years old to make a purchase or create an account. If you are under 18, you may use
              our services only under the supervision of a parent or legal guardian.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">3. User Accounts</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-7">
              <li>Users can create accounts on our website for faster checkout, order tracking, and exclusive offers.</li>
              <li>You are responsible for maintaining the confidentiality of your login details.</li>
              <li>Elf Amor will not be liable for any loss or damage resulting from unauthorized access to your account.</li>
              <li>We reserve the right to suspend or terminate accounts found in violation of our Terms.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">4. Product Information</h2>
            <p className="text-xs text-gray-700 leading-7">
              We strive to provide accurate descriptions, images, and pricing for all our perfumes. However, slight
              variations in colour, packaging, or fragrance may occur. Elf Amor reserves the right to update or discontinue
              any product without notice.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">5. Orders and Payments</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-7">
              <li>Users can purchase products directly from our website through secure online payment gateways.</li>
              <li>Payments are one-time only (no subscriptions offered).</li>
              <li>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>Once your order is confirmed, you will receive a confirmation email or message.</li>
              <li>
                Elf Amor reserves the right to cancel or refuse any order for reasons such as pricing errors,
                unavailability, or suspected fraudulent activity.
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">6. Shipping and Delivery</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-7">
              <li>We deliver across India via trusted delivery partners.</li>
              <li>Estimated delivery times are displayed during checkout but may vary.</li>
              <li>Once your order is shipped, tracking details will be shared through email or SMS.</li>
              <li>Delays due to courier issues, natural events, or other external factors are beyond our control.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">7. Returns, Replacements &amp; Refunds</h2>
            <p className="text-xs text-gray-700 leading-7 mb-2">
              Perfume products are non-returnable once opened. Returns are only accepted for defective, damaged, or
              incorrectly delivered items.
            </p>
            <p className="text-xs text-gray-700 leading-7 mb-2">
              You must notify us within 48 hours of delivery of the product being defective/damaged/incorrect in the form
              of a video capturing the duration from the opening of the product to the product being found
              defective/damaged/incorrect to initiate a return. Refunds, if approved, will be processed through the
              original mode of payment.
            </p>
            <p className="text-xs text-gray-700 leading-7">
              (Refer to our detailed Return &amp; Refund Policy on the website.)
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">8. Promotions, Contests, and Sweepstakes</h2>
            <p className="text-xs text-gray-700 leading-7">
              Elf Amor may occasionally run promotions, contests, or sweepstakes. Participation in such events will be
              governed by separate rules or terms provided at the time of the campaign.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">9. Intellectual Property</h2>
            <p className="text-xs text-gray-700 leading-7">
              All website content, including but not limited to logos, designs, product images, videos, graphics, and
              trademarks, is the exclusive property of Elf Amor. You may not reproduce, distribute, or use any content
              without prior written permission.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">10. Feedback and Suggestions</h2>
            <p className="text-xs text-gray-700 leading-7">
              If you provide feedback, ideas, or suggestions to Elf Amor, you agree that we may use them freely for
              improvement or marketing purposes without any obligation for compensation or credit. Any Intellectual
              Property that may be developed using the feedback or ideas will be solely owned by Elf Amor. The user waives
              any right on such Intellectual Property and agrees to transfer the same to Elf Amor.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">11. User Conduct</h2>
            <ul className="list-disc list-inside text-xs text-gray-700 leading-7">
              <li>Use the Site for lawful purposes only; do not engage in unlawful or fraudulent activities.</li>
              <li>Do not interfere with the website’s operation or security.</li>
              <li>Do not misrepresent your identity or attempt unauthorized access to other users’ accounts.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">12. Limitation of Liability</h2>
            <p className="text-xs text-gray-700 leading-7">
              Elf Amor shall not be liable for any direct, indirect, incidental, or consequential damages arising from the
              use or inability to use our website or products, including but not limited to data loss, profit loss, or
              service interruption.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">13. Indemnification</h2>
            <p className="text-xs text-gray-700 leading-7">
              You agree to indemnify and hold Elf Amor, its affiliates, and employees harmless from any claims or damages
              resulting from your breach of these Terms or misuse of the website.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">14. Governing Law</h2>
            <p className="text-xs text-gray-700 leading-7">
              These Terms shall be governed by and interpreted under the laws of India. Any disputes will be subject to
              the exclusive jurisdiction of courts located in New Delhi, India.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">15. Changes to These Terms</h2>
            <p className="text-xs text-gray-700 leading-7">
              Elf Amor reserves the right to update or modify these Terms at any time. Changes will take effect
              immediately upon being posted on this page. Continued use of the website indicates acceptance of the
              updated Terms.
            </p>
          </section>

          <section className="mb-2">
            <h2 className="font-semibold text-sm text-gray-800 mb-2">16. Contact Us</h2>
            <p className="text-xs text-gray-700 leading-7">
              If you have any questions regarding these Terms, please contact us by visiting our contact page: 
              <Link to="/contact-us" className="underline text-xs">Contact Us</Link> or visit <a href="https://www.elfamor.com/contact-us" target="_blank" rel="noreferrer" className="underline text-xs">https://www.elfamor.com/contact-us</a>.
            </p>
          </section>

          <div className="mt-4 text-xs text-gray-600">
            <em>By using this Site you acknowledge that you have read, understood, and agree to these Terms &amp; Conditions.</em>
          </div>
        </div>
      </div>
    </div>
  );
}
