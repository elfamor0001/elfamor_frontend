// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import bgVideo from "../assets/bgvideo.mp4";

// const API_BASE = (typeof window !== "undefined" && window.__API_BASE__) || "http://localhost:8000";
// const FALLBACK_IMAGE = "/src/assets/logo.png";

// const tryParseJson = async (res) => {
//   const text = await res.text().catch(() => "");
//   try {
//     return JSON.parse(text);
//   } catch {
//     // If it's already JSON (res.json would have worked), or it's empty, handle upstream
//     throw new Error("Invalid JSON response");
//   }
// };

// const getProductImage = (p) => {
//   if (!p) return FALLBACK_IMAGE;
//   // primary_image may be string or object
//   if (p.primary_image) {
//     if (typeof p.primary_image === "string") return p.primary_image;
//     if (p.primary_image.url) return p.primary_image.url;
//     if (p.primary_image.image) return p.primary_image.image;
//     if (p.primary_image.image_url) return p.primary_image.image_url;
//   }

//   // images array: each item may be string or object
//   if (Array.isArray(p.images) && p.images.length > 0) {
//     const primary = p.images.find((i) => i.is_primary) || p.images[0];
//     if (typeof primary === "string") return primary;
//     return primary.image || primary.url || primary.image_url || FALLBACK_IMAGE;
//   }

//   if (p.image) return p.image;
//   if (p.main_image) return p.main_image;

//   return FALLBACK_IMAGE;
// };

// const MainPage = () => {
//   const videoRef = useRef(null);
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const video = videoRef.current;
//     if (video) {
//       video.muted = true;
//       const playPromise = video.play();
//       if (playPromise !== undefined) {
//         playPromise
//           .then(() => {
//             // playing
//           })
//           .catch((err) => {
//             // fallback on user interaction
//             document.addEventListener(
//               "click",
//               () => {
//                 video.play().catch(console.error);
//               },
//               { once: true }
//             );
//           });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const signal = controller.signal;

//     const endpoints = [
//       `${API_BASE}/api/products/products/`,
//       `${API_BASE}/api/products/`,
//       `${API_BASE}/products/`,
//       `${API_BASE}/api/products-list/`,
//     ];

//     const fetchProducts = async () => {
//       setLoading(true);
//       setError("");
//       let lastError = null;
//       for (const ep of endpoints) {
//         try {
//           const res = await fetch(ep, {
//             method: "GET",
//             credentials: "include",
//             headers: { Accept: "application/json" },
//             signal,
//           });

//           if (!res.ok) {
//             // try next endpoint on 404 or non-ok
//             lastError = new Error(`${res.status} ${res.statusText} from ${ep}`);
//             continue;
//           }

//           // parse as json (some django error pages are HTML, so wrap)
//           let data;
//           try {
//             data = await res.json();
//           } catch (e) {
//             // fallback parse attempt to provide debug info
//             const txt = await res.text().catch(() => "");
//             throw new Error(`Expected JSON; got: ${txt.slice(0, 200)}`);
//           }

//           // support paginated {results: [...] } or plain array
//           const items = Array.isArray(data) ? data : data.results || [];
//           // normalize items: ensure id exists and put image via getProductImage
//           const normalized = items.map((p) => ({
//             ...p,
//             _image: getProductImage(p),
//           }));

//           if (!signal.aborted) {
//             setProducts(normalized);
//             setLoading(false);
//           }
//           return;
//         } catch (err) {
//           lastError = err;
//           // continue trying other endpoints
//         }
//       }

//       if (!signal.aborted) {
//         setLoading(false);
//         setError(lastError ? String(lastError.message || lastError) : "Failed to fetch products");
//         setProducts([]);
//       }
//     };

//     fetchProducts();

//     return () => controller.abort();
//   }, []);

//   const navigateToAllProducts = () => {
//     navigate("/products");
//   };

//   const handleProductClick = (product) => {
//     // ensure id exists
//     const id = product?.id ?? product?.pk;
//     if (!id) {
//       // fallback: navigate to products list
//       navigate("/products");
//       return;
//     }
//     navigate(`/productdetails/${id}`);
//   };

//   return (
//     <div className="relative">
//       <section className="sticky top-16 z-0 min-h-screen w-full overflow-hidden">
//         <video
//           ref={videoRef}
//           autoPlay
//           loop
//           muted
//           playsInline
//           preload="metadata"
//           className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-75 saturate-95"
//         >
//           <source src={bgVideo} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </section>

//       <main className="relative z-30">
//         <div className="min-h-screen w-full bg-[#EFEFEF] p-4">
//           {/* header */}
//           <div className="flex text-xs justify-between text-gray-800 items-center relative mt-10 mb-4">
//             <h1>LATEST DROP</h1>
//             <button
//               onClick={navigateToAllProducts}
//               className="text-xs bg-white font-medium text-gray-700 p-1 px-2 transition-colors duration-300 cursor-pointer"
//             >
//               DISCOVER MORE
//             </button>
//           </div>

//           {/* grid */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10 ">
//             {loading
//               ? // skeleton placeholders
//                 Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
//                 ))
//               : error
//               ? (
//                 <div className="col-span-2 lg:col-span-4 text-center text-red-600">
//                   Error loading products: {error}
//                 </div>
//               )
//               : products.length === 0
//               ? (
//                 <div className="col-span-2 lg:col-span-4 text-center text-gray-600">
//                   No products found.
//                 </div>
//               )
//               : // show first 4
//                 products.slice(0, 4).map((product) => (
//                   <div key={product.id ?? product.pk} className="group cursor-pointer">
//                     <div
//                       onClick={() => handleProductClick(product)}
//                       className="overflow-hidden mb-4 aspect-[4/5] relative"
//                     >
//                       <img
//                         src={product._image || FALLBACK_IMAGE}
//                         alt={product.name || "product"}
//                         loading="lazy"
//                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = FALLBACK_IMAGE;
//                         }}
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <h3 className="text-xs font-medium text-gray-900 tracking-wide">{product.name}</h3>
//                       <p className="text-xs text-gray-600">
//                         {product.price ? (typeof product.price === "string" ? product.price : `RS. ${Number(product.price).toFixed(2)}`) : ""}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//           </div>

//           {/* discover more */}
//           <div className="flex justify-center">
//             <button
//               onClick={navigateToAllProducts}
//               className="text-xs cursor-pointer border-1 font-medium text-black hover:text-white hover:bg-black p-2 px-6 hover:rounded-4xl transition-colors duration-300"
//             >
//               DISCOVER MORE
//             </button>
//           </div>

//           <div className="flex justify-between items-center relative pt-10 text-xs mb-4">
//             <h1>MORE FROM ELFAMOR</h1>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
//             {loading
//               ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />)
//               : (products.slice(4, 8).map((product) => (
//                   <div key={product.id ?? product.pk} className="group cursor-pointer">
//                     <div onClick={() => handleProductClick(product)} className="overflow-hidden mb-4 aspect-[4/5] relative">
//                       <img
//                         src={product._image || FALLBACK_IMAGE}
//                         alt={product.name || "product"}
//                         loading="lazy"
//                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = FALLBACK_IMAGE;
//                         }}
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <h3 className="text-xs font-medium text-gray-900 tracking-wide">{product.name}</h3>
//                       <p className="text-xs text-gray-600">{product.price}</p>
//                     </div>
//                   </div>
//                 )))}
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={navigateToAllProducts}
//               className="text-xs cursor-pointer border-1 font-medium text-black hover:text-white hover:bg-black p-2 px-6 hover:rounded-4xl transition-colors duration-300"
//             >
//               DISCOVER MORE
//             </button>
//           </div>

//           <div className="p-4 mt-4 text-xs">
//             <p>Feel the Luxury of Premium with ELFAMOR- Best Fragrance Brand in India</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainPage;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/bgvideo.mp4";

const API_BASE = "https://elfamor.pythonanywhere.com"; // ✅ one stable endpoint
const FALLBACK_IMAGE = "/src/assets/logo.png";

const getProductImage = (p) => {
  if (!p) return FALLBACK_IMAGE;

  if (p.primary_image) {
    if (typeof p.primary_image === "string") return p.primary_image;
    if (p.primary_image.url) return p.primary_image.url;
    if (p.primary_image.image) return p.primary_image.image;
    if (p.primary_image.image_url) return p.primary_image.image_url;
  }

  if (Array.isArray(p.images) && p.images.length > 0) {
    const primary = p.images.find((i) => i.is_primary) || p.images[0];
    if (typeof primary === "string") return primary;
    return primary.image || primary.url || primary.image_url || FALLBACK_IMAGE;
  }

  if (p.image) return p.image;
  if (p.main_image) return p.main_image;
  return FALLBACK_IMAGE;
};

const MainPage = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Autoplay video logic
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        document.addEventListener(
          "click",
          () => video.play().catch(() => {}),
          { once: true }
        );
      });
    }
  }, []);

  // ✅ Instant fetch — no retries, no delay
  useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  const endpoints = [
    `${API_BASE}/api/products/products/`,
    // `${API_BASE}/api/products/products/`,
    // `${API_BASE}/api/products/`,
    // `${API_BASE}/api/products-list/`,
  ];

  // fetch an endpoint and resolve with parsed items array or reject
  const fetchEndpoint = async (ep) => {
    const res = await fetch(ep, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} from ${ep} — ${txt.slice(0, 200)}`);
    }

    // parse JSON (throw if invalid)
    let data;
    try {
      data = await res.json();
    } catch (err) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Invalid JSON from ${ep}: ${txt.slice(0, 300)}`);
    }

    return Array.isArray(data) ? data : data.results || [];
  };

  const fetchFirstAvailable = async () => {
    setLoading(true);
    setError("");
    setProducts([]);

    // start all requests in parallel
    const promises = endpoints.map((ep) => fetchEndpoint(ep));

    try {
      // Promise.any resolves with first fulfilled promise
      // (note: Promise.any rejects only if all promises reject)
      const items = await Promise.any(promises);

      // normalize items quickly
      const normalized = items.map((p) => ({ ...p, _image: getProductImage(p) }));

      if (!signal.aborted) {
        setProducts(normalized);
        setLoading(false);
      }
    } catch (allErr) {
      if (!signal.aborted) {
        // all attempts failed — collect messages for debug
        const errMsg =
          allErr && allErr.errors
            ? allErr.errors.map((e) => (e && e.message) || String(e)).join(" | ")
            : String(allErr);
        console.error("All product endpoints failed:", errMsg);
        setError("Failed to fetch products");
        setProducts([]);
        setLoading(false);
      }
    }
  };

  fetchFirstAvailable();

  return () => controller.abort();
}, []);


  const navigateToAllProducts = () => {
  navigate("/products");
  // Scroll to top of the page
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth' // Optional: adds smooth scrolling
  });
};

 const handleProductClick = (product) => {
  const id = product?.id ?? product?.pk;
  navigate(id ? `/productdetails/${id}` : "/products");
  setTimeout(() => window.scrollTo(-10, -10), 0);
};

  return (
    <div className="relative">
      {/* Background video */}
      <section className="sticky top-16 z-0 min-h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-75 saturate-95"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Content */}
      <main className="relative z-30">
        <div className="min-h-screen w-full bg-[#EFEFEF] p-4">
          {/* Header */}
          <div className="flex text-xs justify-between text-gray-800 items-center relative mt-10 mb-4">
            <h1>LATEST DROP</h1>
            <button
              onClick={navigateToAllProducts}
              className="text-xs bg-white font-medium text-gray-700 p-1 px-2 transition-colors duration-300 cursor-pointer"
            >
              DISCOVER MORE
            </button>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded" />
              ))
            ) : error ? (
              <div className="col-span-2 lg:col-span-4 text-center text-red-600">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-2 lg:col-span-4 text-center text-gray-600">
                No products found.
              </div>
            ) : (
              products.slice(0, 4).map((product) => (
                <div key={product.id ?? product.pk} className="group cursor-pointer">
                  <div
                    onClick={() => handleProductClick(product)}
                    className="overflow-hidden mb-4 aspect-[4/5] relative"
                  >
                    <img
                      src={product._image || FALLBACK_IMAGE}
                      alt={product.name || "product"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {product.price
                        ? typeof product.price === "string"
                          ? product.price
                          : `RS. ${Number(product.price).toFixed(2)}`
                        : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discover more button */}
          <div className="flex justify-center">
            <button
              onClick={navigateToAllProducts}
              className="text-xs cursor-pointer border font-medium text-black hover:text-white hover:bg-black p-2 px-6 rounded transition-colors duration-300"
            >
              DISCOVER MORE
            </button>
          </div>

          <div className="flex justify-between items-center relative pt-10 text-xs mb-4">
            <h1>MORE FROM ELFAMOR</h1>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
                ))
              : products.slice(4, 8).map((product) => (
                  <div
                    key={product.id ?? product.pk}
                    onClick={() => handleProductClick(product)}
                    className="group cursor-pointer"
                  >
                    <div className="overflow-hidden mb-4 aspect-[4/5] relative">
                      <img
                        src={product._image || FALLBACK_IMAGE}
                        alt={product.name || "product"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {product.price
                          ? typeof product.price === "string"
                            ? product.price
                            : `RS. ${Number(product.price).toFixed(2)}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={navigateToAllProducts}
              className="text-xs cursor-pointer border font-medium text-black hover:text-white hover:bg-black p-2 px-6 rounded transition-colors duration-300"
            >
              DISCOVER MORE
            </button>
          </div>

          <div className="p-4 mt-4 text-xs">
            <p>Feel the Luxury of Premium with ELFAMOR — Best Fragrance Brand in India</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
