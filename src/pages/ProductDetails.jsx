import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [hasGiftCard, setHasGiftCard] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Sample product images - you can replace these with actual image URLs
  const productImages = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0b22e9e8819?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop'
  ];

  // Related products data
  const products = [
    {
      id: 1,
      name: 'FOREST AMBUSH EMBROIDERY T-SHIRT',
      price: 'RS. 5,995',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f37f8302?w=400&h=400&fit=crop',
      bgColor: 'bg-slate-800'
    },
    {
      id: 2,
      name: 'EAGLE CRY T-SHIRT',
      price: 'RS. 4,995',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
      bgColor: 'bg-orange-600'
    },
    {
      id: 3,
      name: 'BLACK TIGER T-SHIRT',
      price: 'RS. 3,995',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      bgColor: 'bg-black'
    },
    {
      id: 4,
      name: 'RED HUMMINGBIRD T-SHIRT',
      price: 'RS. 4,495',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
      bgColor: 'bg-red-800'
    }
  ];

  const sizes = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const navigate = useNavigate();

  const navigateToAllProducts = () => {
    navigate('/products');
  };
  const navigateToProductDetails = () => {
    navigate('/productdetails');
  };

  const fullDescription = `BUILT FOR GRIND AND GLORY, THE TRAINING KIT JERSEY IN NAVY AND GREY IS ALL ABOUT FUNCTION MEETING FORM. WHETHER YOU'RE PUTTING IN THE WORK OR REPPING THE CULTURE, THIS PIECE CARRIES THE RELENTLESS ENERGY OF BUDWEISER AND THE REFINED TOUGHNESS OF BLUORG. UNDERSTATED, SHARP, AND MADE TO MOVE WITH YOU.`;
  
  const shortDescription = fullDescription.slice(0, 150) + '...';

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-xs lg:py-20">
      {/* Navigation Breadcrumb */}
      <div className="px-4 py-3  text-gray-700 text-xs">
        HOME › ALL PRODUCTS › TRAINING KIT JERSEY
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden pt-12">
        <div className="space-y-4 px-1">
          {/* Mobile Image Gallery - Horizontal Scroll */}
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              
              {productImages.map((image, index) => (
                <div key={index} className="aspect-square flex-shrink-0 w-full snap-center">
                  <img
                    src={image}
                    alt={`Training Kit Jersey ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            

          {/* Mobile Product Info */}
          <div className="p-2 space-y-4">
              <h1 className="mb-1">TRAINING KIT JERSEY</h1>
              <p className="font-bold text-gray-500">RS. 5,995</p>

            {/* Mobile Size Selection */}
            <div>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-2 px-2 rounded-md text-gray-700 transition-all ${
                      selectedSize === size
                        ? 'border-gray-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Gift Card */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mobileGiftCard"
                checked={hasGiftCard}
                onChange={(e) => setHasGiftCard(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="mobileGiftCard" className="text-gray-700 font-semibold">
                HAVE A GIFT CARD?
              </label>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-1">
              <button className="w-full bg-black rounded-md text-white py-3 px-6 transition-all">
                BUY NOW
              </button>
              <button className="w-full border-1 rounded-md border-gray-700 text-gray-700 py-3 px-6 transition-all">
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Mobile Description - Collapsible */}
          <div className="bg-white border-gray-700 border-1 rounded-md p-3 sm:p-4 lg:p-2 space-y-4 sm:space-y-6 lg:space-y-4">
  {/* Description Section */}
  <div className='flex flex-col sm:flex-row sm:justify-around lg:justify-around'>
    <h3 className="mb-2 sm:mb-3 tracking-tighter text-gray-700 text-sm sm:text-base lg:text-sm font-medium sm:w-1/3 lg:w-auto">
      DESCRIPTION
    </h3>
    <p className="tracking-tighter text-gray-500 text-sm sm:text-base lg:text-sm sm:w-2/3 lg:w-1/2">
      {showFullDescription ? fullDescription : shortDescription}
      <button 
        onClick={() => setShowFullDescription(!showFullDescription)}
        className="underline hover:no-underline font-medium ml-1"
      >
        {showFullDescription ? 'Read Less' : 'Read More'}
      </button>
    </p>
  </div>

  {/* Details Section */}
  <div className='flex flex-col sm:flex-row sm:justify-around lg:justify-around'>
    <h3 className="mb-2 sm:mb-3 tracking-tighter text-gray-700 text-sm sm:text-base lg:text-sm font-medium sm:w-1/3 lg:w-1/2">
      DETAILS
    </h3>
    <div className="space-y-1 tracking-tighter text-gray-500 text-sm sm:text-base lg:text-sm sm:w-2/3">
      <p>REGULAR FIT WITH ATHLETIC STRETCH</p>
      <p>100% POLYESTER</p>
      <p>WEIGHT - 225 GSM</p>
      <p>DIGITAL AND HIGH-DENSITY PRINT</p>
      <p>MACHINE WASH ONLY</p>
    </div>
  </div>

  {/* Shipping Section */}
  <div className='flex flex-col sm:flex-row sm:justify-around lg:justify-around'>
    <h3 className="mb-2 sm:mb-3 tracking-tighter text-gray-700 text-sm sm:text-base lg:text-sm font-medium sm:w-1/3 lg:w-auto">
      SHIPPING
    </h3>
    <div className="space-y-1 tracking-tighter text-gray-500 text-sm sm:text-base lg:text-sm sm:w-2/3">
      <p>PRE-ORDER.</p>
      <p>FREE DELIVERY PAN-INDIA.</p>
      <p>DISPATCH ON AUGUST 02.</p>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen text-[9px]">
        {/* Left Content - Fixed */}
        <div className="w-96 md:w-1/3 xl:w-1/3 overflow-y-auto">
          <div className="absolute md:w-1/3 xl:w-1/3 bottom-0 p-10 space-y-5 ">
            {/* Product Title and Price */}
            <div className='flex justify-between'>
              <h1 className="font-medium">TRAINING KIT JERSEY</h1>
              <p className="font-semibold text-gray-500">RS. 5,995</p>
            </div>

            {/* Description */}
            <div className='text-gray-700 tracking-tight'>
              <h3 className="mb-1 font-semibold">DESCRIPTION</h3>
              <p className="leading-relaxed">
                {showFullDescription ? fullDescription : shortDescription}
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="hover:underline font-medium text-gray-700 hover:cursor-pointer"
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              </p>
            </div>

            {/* Details */}
            <div className='text-gray-700 tracking-tight'>
              <h3 className="font-semibold mb-1">DETAILS</h3>
              <div className="space-y-1 ">
                <p>REGULAR FIT WITH ATHLETIC STRETCH</p>
                <p>100% POLYESTER</p>
                <p>WEIGHT - 225 GSM</p>
                <p>DIGITAL AND HIGH-DENSITY PRINT</p>
                <p>MACHINE WASH ONLY</p>
              </div>
            </div>

            {/* Shipping */}
            <div className='text-gray-700 tracking-tight'>
              <h3 className="font-semibold mb-1">SHIPPING</h3>
              <div className="space-y-1">
                <p>PRE-ORDER.</p>
                <p>FREE DELIVERY PAN-INDIA.</p>
                <p>DISPATCH ON AUGUST 02.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Vertically Scrollable Photo Gallery */}
        <div className="flex-1 h-10/12 relative overflow-y-auto" style={{
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    WebkitOverflowScrollbar: { display: 'none' }}}>
          <div className="space-y-0.5">
            {productImages.map((image, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={image}
                  alt={`Training Kit Jersey ${index + 1}`}
                  className="w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Fixed */}
        <div className="w-96 xl:w-1/3 overflow-y-auto text-gray-700">
          <div className="bottom-0 xl:w-1/3 p-10 absolute right-0 space-y-4">
            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">SIZE</h3>
              </div>
              
              <div className="grid grid-cols-5 gap-1 mb-1">
                {sizes.slice(0).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-2 px-3 transition-all rounded-md hover:cursor-pointer ${
                      selectedSize === size
                        ? 'border-gray-700'
                        : 'border-gray-300 hover:border-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Card Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="giftCard"
                checked={hasGiftCard}
                onChange={(e) => setHasGiftCard(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="giftCard" className="font-medium">
                HAVE A GIFT CARD?
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 ">
              <button className="w-full border-1 border-gray-700 text-gray-700 py-3 px-6 font-semibold transition-all rounded-md hover:cursor-pointer">
                ADD TO CART
              </button>
              <button className="w-full bg-black hover:cursor-pointer text-white py-3 px-6 transition-all rounded-md">
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="bg-[#EFEFEF] px-4 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs text-gray-700">YOU MAY ALSO LIKE</h2>
          <button  onClick={navigateToAllProducts}
            className="text-xs bg-white font-medium text-gray-700 p-1 px-2 transition-colors duration-300 hover:cursor-pointer">
          DISCOVER MORE
        </button>
        </div>
        

        <div onClick={navigateToProductDetails} className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10 ">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className={" overflow-hidden mb-4 aspect-[4/5] relative"}>
             <img src="src/assets/elf amor final logo.jpg" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            {/* Product Info */}
             <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ProductDetails;