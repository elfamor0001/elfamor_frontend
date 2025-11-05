const ProductCard = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className={`${product.bgColor} overflow-hidden mb-4 aspect-[4/5] relative`}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <svg 
                  className="w-32 h-32 mx-auto mb-4 opacity-80" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div className="text-lg font-bold tracking-wider">
                  {product.name.includes('GATOR') ? 'GATOR-AIDE' : 'LACOSTUER'}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 tracking-wide">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              {product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
