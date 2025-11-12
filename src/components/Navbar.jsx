import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';  

// Navbar Component
export const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApparelOpen, setIsApparelOpen] = useState(false);
  const [isMobileApparelOpen, setIsMobileApparelOpen] = useState(false);
  const [productNames, setProductNames] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = "https://elfamor.pythonanywhere.com";

  // State for dynamic cart count
  const [dynamicCartCount, setDynamicCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  // Function to fetch cart count from API
  const fetchCartCount = async () => {
    try {
      setLoadingCart(true);
      const res = await fetch(`${API_BASE}/api/cart/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const cartData = await res.json();
        // Calculate total items count from cart data
        if (cartData && cartData.items) {
          const totalItems = cartData.items.reduce((total, item) => {
            return total + (item.quantity || 0);
          }, 0);
          setDynamicCartCount(totalItems);
        } else {
          setDynamicCartCount(0);
        }
      } else {
        setDynamicCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setDynamicCartCount(0);
    } finally {
      setLoadingCart(false);
    }
  };

  // Fetch product names from API - EXACT SAME LOGIC AS ALLPRODUCTS
  useEffect(() => {
    const fetchProductNames = async () => {
      setLoadingProducts(true);
      setProductNames([]);
      
      const controller = new AbortController();
      const endpoints = [
        `${API_BASE}/api/products/products/`,
        `${API_BASE}/api/products/`,
        `${API_BASE}/products/`,
        `${API_BASE}/api/products-list/`,
      ];

      let lastError = null;

      for (const ep of endpoints) {
        try {
          console.log(`Navbar trying endpoint: ${ep}`);
          const res = await fetch(ep, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });

          if (!res.ok) {
            lastError = new Error(`${res.status} ${res.statusText} from ${ep}`);
            console.log(`Navbar endpoint failed: ${ep} - ${res.status}`);
            continue;
          }

          // Parse JSON safely - SAME AS ALLPRODUCTS
          let data;
          try {
            data = await res.json();
          } catch (e) {
            const txt = await res.text().catch(() => "");
            console.log(`Navbar JSON parse error from ${ep}:`, txt.slice(0, 300));
            continue;
          }

          console.log(`Navbar received data from ${ep}:`, data);

          // Extract items array - SAME LOGIC AS ALLPRODUCTS
          const items = Array.isArray(data) ? data : data.results || [];
          console.log(`Navbar extracted ${items.length} items from ${ep}`);

          if (items.length > 0) {
            // Extract unique product names
            const uniqueProducts = items
              .filter(product => product.name && product.name.trim() !== '')
              .map(product => ({
                id: product.id || product.pk,
                name: product.name.trim(),
                brand: product.brand || ''
              }))
              .filter((product, index, self) =>
                index === self.findIndex(p => 
                  p.name.toLowerCase() === product.name.toLowerCase()
                )
              )
              .sort((a, b) => a.name.localeCompare(b.name));

            console.log(`Navbar setting ${uniqueProducts.length} unique products`);
            setProductNames(uniqueProducts);
            setLoadingProducts(false);
            return;
          }
        } catch (err) {
          console.log(`Navbar fetch error from ${ep}:`, err);
          lastError = err;
          continue;
        }
      }

      // If we get here, all endpoints failed
      console.log('Navbar all endpoints failed');
      setProductNames([]);
      setLoadingProducts(false);
    };

    fetchProductNames();
  }, []);

  // Fetch cart count on component mount and when location changes
  useEffect(() => {
    fetchCartCount();
  }, [location.pathname]); // Refetch when user navigates

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when navigating away
  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigateToAllProducts = () => {
    navigate('/products');
  };

  const navigateToCart = () => {
    // Refresh cart count before navigating
    fetchCartCount();
    navigate('/cart');
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchOpen(true);
    setIsApparelOpen(false);
  };

  const handleCloseSearch = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ search: searchQuery.trim() });
      navigate(`/products?${params.toString()}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    } else if (e.key === 'Escape') {
      handleCloseSearch(e);
      setIsApparelOpen(false);
      setIsMobileApparelOpen(false);
    }
  };

  const handleApparelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApparelOpen(!isApparelOpen);
    setIsSearchOpen(false);
  };

  const handleApparelMouseEnter = () => {
    setIsApparelOpen(true);
    setIsSearchOpen(false);
  };

  const handleApparelMouseLeave = () => {
    setIsApparelOpen(false);
  };

  const handleMobileApparelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileApparelOpen(!isMobileApparelOpen);
  };

  // Use search functionality for product names
  const handleProductClick = (productName) => {
    if (!productName) return;

    // Use the same search parameter as the search bar
    const params = new URLSearchParams({ search: productName });
    navigate(`/products?${params.toString()}`);

    setIsApparelOpen(false);
    setIsMobileApparelOpen(false);
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isApparelOpen && !event.target.closest('.relative')) {
        setIsApparelOpen(false);
      }
      if (isSearchOpen && !event.target.closest('.search-overlay')) {
        handleCloseSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isApparelOpen, isSearchOpen]);

  useEffect(() => {
    setDropdownOpen(false);
  }, [user]);

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    navigate('/auth');
  };

  return (
    <>
      {/* Top Banner */}
      <div className="fixed z-50 bg-[#1c1c1c] text-white text-center p-1 top-0 text-xs font-medium tracking-wider w-screen">
        <h1>ELFAMOR</h1>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay z-50 fixed top-6 left-0 right-0 bg-[#EFEFEF] border-b border-gray-300 h-16 flex items-center">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="w-full flex items-center px-6">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                placeholder="SEARCH PRODUCTS..."
                className="flex-1 bg-transparent text-sm font-medium text-gray-700 placeholder-gray-500 outline-none tracking-wider uppercase"
                style={{ fontSize: '12px' }}
              />
              <button
                type="button"
                onClick={handleCloseSearch}
                className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="fixed bg-[#EFEFEF] top-6 w-screen z-40">
        <div className="mx-auto mb-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9">
            {/* Logo */}
            <div className="flex-shrink-0 mt-6 hover:cursor-pointer">
              <a onClick={navigateToHome} className="">
                <img className='h-20 w-20' src={logoImg} alt="" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden mt-6 ml-24 md:flex space-x-6 lg:space-x-8 relative">
              <button
                onClick={navigateToAllProducts}
                className={`text-xs font-medium transition-colors hover:cursor-pointer duration-300 ${currentPage === 'home' ? 'text-gray-500' : 'text-gray-500 hover:text-black'}`}
              >
                NEW IN
              </button>

              {/* FRAGRANCES with dropdown */}
              <div className="relative">
                <button
                  onClick={handleApparelClick}
                  onMouseEnter={handleApparelMouseEnter}
                  className="text-xs font-medium text-gray-500 hover:text-black transition-colors duration-300 hover:cursor-pointer"
                  type="button"
                >
                  FRAGRANCES
                </button>

                {/* Dropdown List */}
                {isApparelOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#EFEFEF] border border-gray-200 shadow-lg z-[60] max-h-80 overflow-y-auto">
                    <div
                      className="py-2"
                      onMouseLeave={handleApparelMouseLeave}
                    >
                      {loadingProducts ? (
                        <div className="px-4 py-2 text-xs text-gray-500">Loading products...</div>
                      ) : productNames.length > 0 ? (
                        productNames.map((product) => (
                          <button 
                            key={product.id || product.name}
                            onClick={() => handleProductClick(product.name)}
                            className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer truncate"
                            title={product.name}
                          >
                            {product.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-xs text-gray-500">
                          No products found. Check console for details.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden mt-6 md:flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={handleSearchClick}
                className="text-xs font-medium text-gray-500 hover:text-black transition-colors duration-300 hover:cursor-pointer"
                type="button"
              >
                SEARCH
              </button>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    {user.profilePicUrl ? (
                      <img
                        src={user.profilePicUrl}
                        alt="Avatar"
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle size={24} className="text-gray-600" />
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
                      <a
                        href="/orders"
                        className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-black"
                      >
                        My Orders
                      </a>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="text-xs font-medium text-gray-500 hover:text-black"
                >
                  LOGIN
                </button>
              )}
              <button
                onClick={navigateToCart}
                className="bg-gray-900 text-white p-2 transition-colors duration-300 animate-revolve icon-3d hover:cursor-pointer relative z-10"
              >
                <ShoppingBag size={16} />
                
              </button>
              {/* Cart Count Badge */}
                {dynamicCartCount > 0 && (
                  <span className="absolute top-2 md:right-7 lg:right-12 bg-black text-white text-[10px] font-semibold px-[5px] py-[1px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center z-10">
                    {dynamicCartCount > 99 ? '99+' : dynamicCartCount}
                  </span>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="z-50 md:hidden flex items-center px-2 mt-4 space-x-5">
              <button
                onClick={handleSearchClick}
                className="font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300"
                type="button"
              >
                <Search size={16} />
              </button>
              <button
                onClick={navigateToCart}
                className="bg-gray-900 text-white p-2 transition-colors duration-300 animate-revolve icon-3d hover:cursor-pointer relative z-10"
              >
                <ShoppingBag size={16} />
                
              </button>
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-black transition-colors duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              {/* Cart Count Badge */}
                {dynamicCartCount > 0 && (
                  <span className="absolute top-1 right-16 z-10 bg-black text-white text-[10px] font-semibold px-[5px] py-[1px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {dynamicCartCount > 99 ? '99+' : dynamicCartCount}
                  </span>
                )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="z-50 md:hidden border-t border-gray-200 bg-[#EFEFEF]">
            <div className="px-4 z-50 text-xs pt-2 pb-3 space-y-1">
              <button
                onClick={navigateToHome}
                className={`block w-full text-left px-3 py-2 font-medium transition-colors duration-300 ${currentPage === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-black'}`}
              >
                NEW IN
              </button>
              <button
                onClick={handleMobileApparelClick}
                className="block w-full text-left px-3 py-2 font-medium text-gray-500 hover:text-black transition-colors duration-300"
              >
                FRAGRANCES
              </button>

              {/* Mobile Apparel Dropdown */}
              {isMobileApparelOpen && (
                <div className="ml-6 space-y-1 max-h-60 overflow-y-auto">
                  {loadingProducts ? (
                    <div className="px-3 py-2 text-xs text-gray-500">Loading products...</div>
                  ) : productNames.length > 0 ? (
                    productNames.map((product) => (
                      <button 
                        key={product.id || product.name}
                        onClick={() => handleProductClick(product.name)}
                        className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No products found. Check console.
                    </div>
                  )}
                </div>
              )}

              <hr className="my-2" />
              <button
                onClick={handleSearchClick}
                className="block w-full text-left px-3 py-2 font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300"
              >
                SEARCH
              </button>
              {user ? (
                <div className="relative px-3 py-2">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-full transition"
                  >
                    {user.profilePicUrl ? (
                      <img
                        src={user.profilePicUrl}
                        alt="Avatar"
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle size={24} className="text-gray-600" />
                    )}
                    <span className="text-xs font-medium text-gray-500">Profile</span>
                  </button>

                  {dropdownOpen && (
                    <div className="mt-2 w-full bg-white rounded-md shadow-lg border z-50">
                      <a
                        href="/orders"
                        className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-black"
                      >
                        My Orders
                      </a>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="block w-full text-left px-3 py-2 font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;