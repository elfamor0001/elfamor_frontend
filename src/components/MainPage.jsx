  import React, { useEffect, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';
import fallbackImage from "../assets/logo new new new.png"; // <- update filename/path if needed
import bgVideo from "../assets/bgvideo.mp4"; // <- update filename/path if needed

  const MainPage = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate(); 

    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        video.muted = true; // Ensure it's muted for autoplay
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video is playing');
            })
            .catch((error) => {
              console.log('Auto-play was prevented:', error);
              // Fallback: try to play on user interaction
              document.addEventListener('click', () => {
                video.play().catch(console.error);
              }, { once: true });
            });
        }
      }
    }, []);

    const navigateToAllProducts = () => {
      navigate('/products');
    };

    const navigateToProductDetails = () => {
      navigate('/productdetails');
    };

    const products = [
      {
        id: 1,
        name: "AMOR DE OUD",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762274800/1_thcqc8.jpg",
      },
      {
        id: 2,
        name: "BILLION OUD",
        price: "RS. 4,495",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762277359/1_x9oa0a.jpg",
      },
      {
        id: 3,
        name: "COZYFOX",
        price: "RS. 4,495",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328569/1_hedtef.jpg",
      },
      {
        id: 4,
        name: "DU ROI 5",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328626/1_odnfob.jpg",
      },
      {
        id: 5,
        name: "ELF WOOD",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328662/1_sh6egr.jpg",
      },
      {
        id: 6,
        name: "LA VIE",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328702/1_opo88q.jpg",
      },
      {
        id: 7,
        name: "MAD WISHER",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328715/1_hvqw28.jpg",
      },
      {
        id: 8,
        name: "MIAM PISTACHE",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328728/1_ziswwe.jpg",
      },
      {
        id: 9,
        name: "SATIN WAVE",
        price: "RS. 4,995",
        image: "https://res.cloudinary.com/dymijrcgb/image/upload/v1762328815/1_r8q2na.jpg",
      }
    ];

    return (
      <div className="relative">
         <section className="sticky top-16 z-0 min-h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={fallbackImage}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-75 saturate-95"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
      <main className="relative z-40">
      <div className="min-h-screen w-full bg-[#EFEFEF] p-4">
        {/* Product Grid */}
        <div className="flex text-xs justify-between text-gray-800 items-center relative mt-10 mb-4">
          <h1>LATEST DROP</h1>
          <button  onClick={navigateToAllProducts}
              className="text-xs bg-white font-medium text-gray-700 p-1 px-2 transition-colors duration-300 cursor-pointer">
            DISCOVER MORE
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10 ">
          {products.filter(product => product.id >= 1 && product.id <= 4).map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div onClick={navigateToProductDetails} className={" overflow-hidden mb-4 aspect-[4/5] relative"}>
              <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
              </div>
              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {/* {product.price} */}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Discover More Button */}
        <div className="flex justify-center">
          <button  onClick={navigateToAllProducts}
              className="text-xs cursor-pointer border-1 font-medium text-black hover:text-white hover:bg-black p-2 px-6 hover:rounded-4xl transition-colors duration-300">
            DISCOVER MORE
          </button>
        </div>

        <div className="flex justify-between items-center relative pt-10 text-xs mb-4">
          <h1>MORE FROM ELFAMOR</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
          {products.filter(product => product.id >= 5 && product.id <= 8).map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className={"overflow-hidden mb-4 aspect-[4/5] relative"}>
                <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
              </div>
              
              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {/* {product.price} */}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Discover More Button */}
        <div className="flex justify-center">
          <button  onClick={navigateToAllProducts}
              className="text-xs cursor-pointer border-1 font-medium text-black hover:text-white hover:bg-black p-2 px-6 hover:rounded-4xl transition-colors duration-300">
            DISCOVER MORE
          </button>
        </div>
        <div className='p-4 mt-4 text-xs'>
          <p>Feel the Luxury of Premium with ELFAMOR- Best Fragrance Brand in India</p>
        </div>
      </div>
      </main>
      </div>
    );
  };

  export default MainPage;