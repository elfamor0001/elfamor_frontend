
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

export const Footer = () =>{
  
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };
    return (
        <>
        {/* Top Banner */}
      <div className="bg-[#1c1c1c] text-gray-200 p-3 text-center text-xs font-medium tracking-wider w-full overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
        <span className="mx-12">SHIPPING NATIONWIDE</span>
      </div>
      </div>
      <footer className="bg-[#EFEFEF] mb-0 lg:pt-15 lg:px-30">
  <div className="max-w-full overflow-hidden relative p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 flex flex-col lg:flex-row lg:justify-between items-center gap-6 lg:gap-8">
    
    {/* Logo and Creator Section */}
    <div className="text-center flex flex-col items-center gap-3 lg:gap-4">
      <a
                onClick={navigateToHome}
                className=""
              >
      <img 
        className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain cursor-pointer" 
        src={logoImg}
        alt="Elf Amor Logo" 
      />
      </a>
    </div>

    {/* Links Section */}
    <div className="flex items-center justify-center flex-col sm:grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-2 sm:gap-3 md:gap-2 xl:gap-6">
      <a 
        href="/refund-policy" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        RETURNS POLICY
      </a>
      <a 
        href="/about" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        ABOUT
      </a>
      <a 
        href="/contact-us" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        CONTACT US
      </a>
      <a 
        href="/shipping" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        SHIPPING POLICY
      </a>
      <a 
        href="/terms" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        TERMNATION</a>
    </div>
  </div>
</footer>
      <div className="flex items-center justify-around bg-[#1c1c1c] text-gray-200 p-3 text-center text-xs font-medium tracking-wider w-full ">
        <h1>Connect</h1>
        <a href="https://www.instagram.com/_elfamor_/"><h1>Instagram</h1></a>
        <h1>Youtube</h1>
      </div>
      </>
      );
};

export default Footer;