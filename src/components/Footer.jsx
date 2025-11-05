
import logoImg from "../assets/logo.png";

export const Footer = () =>{
    return (
        <>
        {/* Top Banner */}
      <div className="z-40 bg-[#1c1c1c] text-gray-200 p-3 text-center text-xs font-medium tracking-wider w-full overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
        <span className="mx-12">SHIPPING WORLDWIDE</span>
      </div>
      </div>
      <footer className="z-40 bg-[#EFEFEF] mb-0 lg:pt-15 lg:px-30">
  <div className="max-w-full overflow-hidden relative p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 flex flex-col lg:flex-row lg:justify-between items-center gap-6 lg:gap-8">
    
    {/* Logo and Creator Section */}
    <div className="z-50 text-center flex flex-col items-center gap-3 lg:gap-4">
      <img 
        className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-30 lg:w-30 object-contain" 
        src={logoImg}
        alt="Elf Amor Logo" 
      />
      {/* <p className="text-xs sm:text-xs md:text-xs text-gray-700 font-medium">
        CREATED BY SIDH & DEEPANSHU
      </p> */}
    </div>

    {/* Links Section */}
    <div className="z-50 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 lg:gap-2 xl:gap-3 text-center">
      <a 
        href="#about" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        ABOUT US
      </a>
      <a 
        href="#contact" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        CONTACT US
      </a>
      <a 
        href="#faqs" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        FAQS
      </a>
      <a 
        href="#shipping" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        SHIPPING & RETURN POLICY
      </a>
      <a 
        href="#privacy" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        PRIVACY POLICY
      </a>
      <a 
        href="#terms" 
        className="text-xs text-gray-700 hover:text-gray-900 transition-colors duration-300 cursor-pointer"
      >
        TERMS & CONDITIONS
      </a>
    </div>
  </div>
</footer>
      <div className="z-50 flex items-center justify-around bg-[#1c1c1c] text-gray-200 p-3 text-center text-xs font-medium tracking-wider w-full ">
        <h1>Connect</h1>
        <h1>Instagram</h1>
        <h1>Youtube</h1>
      </div>
      </>
      );
};

export default Footer;