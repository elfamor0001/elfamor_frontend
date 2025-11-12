import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://your-api-endpoint.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', comment: '' });
      
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efefef] py-14 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-gray-600 text-sm font-semibold tracking-wider uppercase mb-6">
            CONNECT WITH THE BRAND
          </h2>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4">
            WE WOULD LOVE TO HEAR ABOUT YOUR FEEDBACK, INTERESTS AND FUTURE COLLABORATIONS. REACH OUT TO US ON EMAIL AT{' '}
            <a href="mailto:CONTACT@ELFAMOR001@GMAIL.COM" className="text-gray-900 hover:underline">
              CONTACT@ELFAMOR001@GMAIL.COM
            </a>
            . OUR DEDICATED CUSTOMER SUPPORT NUMBER CAN BE REACHED ON{' '}
            <span className="text-gray-900">8448441398</span>, MONDAY TO SATURDAY, 11.30 AM TO 8:00 PM.
          </p>
          <p className="text-gray-600 text-xs font-medium tracking-wide">
            ELFAMOR
          </p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">Message sent successfully! We'll get back to you soon.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-[#efefef] p-3 md:p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
                EMAIL *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors text-sm"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="comment" className="block text-xs font-medium text-gray-700 mb-2 tracking-wide">
              COMMENT
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:bg-white transition-colors resize-none text-sm"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-16 py-4 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  SENDING...
                </span>
              ) : (
                'SEND'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}