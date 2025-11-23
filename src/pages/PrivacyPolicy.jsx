const privacyText = [
  `Welcome to Elf Amor (“we”, “our”, “us”). This Privacy Policy explains how we collect, use, and protect your personal information when you visit or make a purchase from our website — www.elfamor.com. By using our website, you consent to the collection and use of your information in accordance with this policy.`,

  `1. Company Information  
  Company Name: Elf Amor  
  Registered Address: GROUND FLOOR, House No. 190, Amarnagar, Ashoka Enclave Part 1, Sector 34, Faridabad, Haryana, 121003, India  
  Website: https://www.elfamor.com  
  The Company operates as an online perfume and fragrance retailer based in India.`,

  `2. Information We Collect  
  We collect the following personal information to fulfill orders and enhance user experience:  
  • Full Name  
  • Email Address  
  • Phone Number  
  • Billing and Shipping Address  
  This information is collected when you register, place an order, subscribe, or contact us through our website.`,

  `3. How We Use Your Information  
  We may use your personal data:  
  • To process, confirm, and deliver your orders  
  • To communicate regarding orders, returns, or support  
  • To send promotional offers (only if opted in)  
  • To personalize and improve your shopping experience  
  • To comply with legal obligations`,

  `4. Payment Information  
  Payments are processed securely via Razorpay.  
  We do not store your full payment card details.  
  Razorpay Privacy Policy: https://razorpay.com/privacy/`,

  `5. Email Communication  
  We use Mailchimp to send transactional and promotional emails to users who opt in.  
  You may unsubscribe anytime using the link in our emails.`,

  `6. Analytics and Cookies  
  We use Google Analytics and similar tools to analyze visitor activity.  
  Data collected may include IP address, device details, pages visited, and time spent.  
  Cookies are used to enhance your browsing experience.  
  You can disable cookies in your browser settings.`,

  `7. Remarketing and Advertising  
  We use remarketing services to show ads to previous visitors on:  
  • Google Ads  
  • Facebook Ads  
  You can opt out anytime via Google Ads Settings or Facebook Ad Preferences.`,

  `8. Information Sharing and Disclosure  
  We do not sell or rent your personal data.  
  We may share limited information with trusted service providers:  
  • Razorpay (Payments)  
  • Mailchimp (Emails)  
  • Google Analytics  
  • Google Ads & Facebook Ads  
  These providers are bound to handle your data safely.`,

  `9. Data Retention  
  We retain your data as long as needed for business or legal purposes.  
  Once no longer required, it is deleted or anonymized.`,

  `10. Data Security  
  We implement strict security measures but cannot guarantee 100% protection from cyber threats.`,

  `11. Your Rights  
  You have the right to:  
  • Access and review your personal information  
  • Request data correction or deletion  
  • Withdraw consent for marketing  
  To exercise these rights, please visit our contact page.`,

  `12. Children’s Privacy  
  Our services are not intended for individuals under 18.  
  We do not knowingly collect personal information from minors.`,

  `13. Updates to This Policy  
  This Privacy Policy may be updated periodically.  
  Changes will be reflected with an updated “Last Modified” date.`,

  `14. Contact Us  
  For any questions or concerns, please contact us at https://www.elfamor.com/contact-us`
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111827] py-15 px-4 sm:px-6 lg:px-24 mt-12">
      <div className="mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-sm tracking-widest text-gray-600">PRIVACY POLICY</h1>
          <p className="text-xs text-gray-600 mt-2">
            Last updated: {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </p>
        </div>

        {/* Body */}
        <div>
          <div className="mb-6 space-y-4">
            {privacyText.map((p, i) => (
              <p key={i} className="text-xs sm:text-sm text-gray-700 leading-6 whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 border-t pt-4">
            <p className="text-xs sm:text-sm text-gray-700">
              <strong>CONTACT US:</strong> For any Privacy Policy inquiries, email us at <a href="https://www.elfamor.com/contact-us" target="_blank" rel="noreferrer" className="underline text-xs">https://www.elfamor.com/contact-us</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
