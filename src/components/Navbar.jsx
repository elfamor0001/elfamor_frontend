import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Navbar Component
export const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApparelOpen, setIsApparelOpen] = useState(false);
  const [isMobileApparelOpen, setIsMobileApparelOpen] = useState(false); 
  const inputRef = useRef(null);

  const navigate = useNavigate(); 

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigateToAllProducts = () => {
    navigate('/products');
  }

  const navigateToCart = () => {
    navigate('/cart');
  }

  const handleSearchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Search clicked!'); // Debug log
    setIsSearchOpen(true);
    setIsApparelOpen(false); // Close apparel dropdown when search opens
  };

  const handleCloseSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleApparelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApparelOpen(!isApparelOpen);
    setIsSearchOpen(false); // Close search when apparel opens
  };

    const handleApparelMouseEnter = () => {
    setIsApparelOpen(true);
    setIsSearchOpen(false); // Close search when apparel opens
  };

  const handleApparelMouseLeave = () => {
    setIsApparelOpen(false);
  };

  const handleMobileApparelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileApparelOpen(!isMobileApparelOpen);
  };

  const handleApparelItemClick = (item) => {
    console.log('Selected:', item);
    setIsApparelOpen(false);
     setIsMobileApparelOpen(false);
    setIsMenuOpen(false);
    // Add your navigation logic here
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseSearch(e);
      setIsApparelOpen(false); // Close apparel dropdown on Escape
       setIsMobileApparelOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isApparelOpen && !event.target.closest('.relative')) {
        setIsApparelOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isApparelOpen]);

  return (
    <>
      {/* Top Banner */}
      <div className="fixed z-50 bg-[#1c1c1c] text-white text-center p-1 top-0 text-xs font-medium tracking-wider w-screen">
        <h1>ELFAMOR</h1>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed top-6 left-0 right-0 z-[70] bg-[#EFEFEF] border-b border-gray-300 h-16 flex items-center">
          <div className="w-full flex items-center px-6">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SEARCH"
              className="flex-1 bg-transparent text-sm font-medium text-gray-700 placeholder-gray-500 outline-none tracking-wider uppercase"
              style={{ fontSize: '12px' }}
            />
            <button
              onClick={handleCloseSearch}
              className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="fixed bg-[#EFEFEF] top-6 w-screen z-50">
        <div className="mx-auto mb-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9">
            {/* Logo */}
            <div className="flex-shrink-0 mt-6 hover:cursor-pointer">
              <a
                onClick={navigateToHome}
                className=""
              >
                <img className='h-20 w-20' src="src/assets/logo.png" alt="" />
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
              
              {/* APPAREL with dropdown */}
              <div className="relative">
                <button 
                  onClick={handleApparelClick}
                onMouseEnter={handleApparelMouseEnter}
                  className="text-xs font-medium text-gray-500 hover:text-black transition-colors duration-300 hover:cursor-pointer"
                  type="button"
                >
                  FRANGRANCES
                </button>
                
                {/* Dropdown List */}
                {isApparelOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#EFEFEF] border border-gray-200 shadow-lg z-[60]">
                    <div className="py-2 " 
                onMouseLeave={handleApparelMouseLeave}
                  onClick={handleApparelClick}>
                      <button
                        onClick={() => handleApparelItemClick('AMOR DE OUD')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        AMOR DE OUD
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('BILLION OUD')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        BILLION OUD
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('COZYFOX')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        COZYFOX
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('DU ROI 5')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        DU ROI 5
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('ELF WOOD')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        ELF WOOD
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('LA VIE')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        LA VIE
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('MAD WISHER')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        MAD WISHER
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('MIAM PISTACHE')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        MIAM PISTACHE
                      </button>
                      <button
                        onClick={() => handleApparelItemClick('SATIN WAVE')}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 hover:cursor-pointer"
                      >
                        SATIN WAVE
                      </button>
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
              <button className="text-xs font-medium text-gray-500 hover:cursor-pointer hover:text-black transition-colors duration-300">
                LOGIN
              </button>
              <button
              onClick={navigateToCart}
              className="bg-gray-900 text-white p-2 transition-colors duration-300 animate-revolve icon-3d hover:cursor-pointer relative z-10">
                <ShoppingBag size={16} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center px-2 mt-4 space-x-5">
              <button 
                onClick={handleSearchClick}
                className="font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300"
                type="button"
              >
                <Search size={16}/>
              </button>
              <button
              onClick={navigateToCart}
               className="bg-gray-900 text-white p-2 transition-colors duration-300 animate-revolve icon-3d hover:cursor-pointer relative z-10">
                <ShoppingBag size={16} />
              </button>
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-black transition-colors duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-[#EFEFEF]">
            <div className="px-4 z-50 text-xs pt-2 pb-3 space-y-1">
              <button 
                onClick={navigateToHome}
                className={`block w-full text-left px-3 py-2 font-medium transition-colors duration-300 ${currentPage === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-black'}`}
              >
                NEW IN
              </button>
              <button 
                  onClick={handleMobileApparelClick}
                  className="block w-full text-left px-3 py-2  font-medium text-gray-500 hover:text-black transition-colors duration-300">
                FRAGRANCES
              </button>

               {/* Mobile Apparel Dropdown */}
                {isMobileApparelOpen && (
                  <div className="ml-6 space-y-1">
                    <button
                      onClick={() => handleApparelItemClick('T-Shirts')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      AMOR DE OUD
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Hoodies')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      BILLION OUD
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Jackets')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      COZYFOX
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Pants')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      DU ROI 5
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Shorts')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      ELF WOOD
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Accessories')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      LA VIE
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Accessories')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      MAD WISHER
                    </button>
                    <button
                      onClick={() => handleApparelItemClick('Accessories')}
                      className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                    >
                      MIAM PISTACHE
                    </button>
                  </div>
                )}

              <hr className="my-2" />
              <button className="block w-full text-left px-3 py-2 font-medium text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-300">
                LOGIN
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;