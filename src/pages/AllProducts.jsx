// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import MenuBar from "../components/MenuBar";

// const API_BASE = (typeof window !== "undefined" && window.__API_BASE__) || "http://localhost:8000";
// const FALLBACK_IMAGE = "/src/assets/logo.png"; // same fallback used in MainPage

// // same tolerant image picker as your MainPage
// const getProductImage = (p) => {
//   if (!p) return FALLBACK_IMAGE;
//   if (p.primary_image) {
//     if (typeof p.primary_image === "string") return p.primary_image;
//     if (p.primary_image.url) return p.primary_image.url;
//     if (p.primary_image.image) return p.primary_image.image;
//     if (p.primary_image.image_url) return p.primary_image.image_url;
//   }
//   if (Array.isArray(p.images) && p.images.length > 0) {
//     const primary = p.images.find((i) => i.is_primary) || p.images[0];
//     if (typeof primary === "string") return primary;
//     return primary.image || primary.url || primary.image_url || FALLBACK_IMAGE;
//   }
//   if (p.image) return p.image;
//   if (p.main_image) return p.main_image;
//   return FALLBACK_IMAGE;
// };

// // normalise relative urls (e.g. "/media/..." -> "http://localhost:8000/media/...")
// function normalizeImageUrl(url) {
//   if (!url) return null;
//   if (/^https?:\/\//i.test(url)) return url;
//   if (/^\/\//.test(url)) return `${window.location.protocol}${url}`;
//   if (url.startsWith("/")) return `${API_BASE.replace(/\/$/, "")}${url}`;
//   return `${API_BASE.replace(/\/$/, "")}/${url}`;
// }

// const AllProducts = () => {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

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
//             lastError = new Error(`${res.status} ${res.statusText} from ${ep}`);
//             continue;
//           }

//           // parse JSON safely (some Django error pages may be HTML)
//           let data;
//           try {
//             data = await res.json();
//           } catch (e) {
//             const txt = await res.text().catch(() => "");
//             throw new Error(`Expected JSON; got: ${txt.slice(0, 300)}`);
//           }

//           const items = Array.isArray(data) ? data : data.results || [];
//           const normalized = items.map((p) => {
//             const rawImage = getProductImage(p);
//             const image = normalizeImageUrl(rawImage) || FALLBACK_IMAGE;
//             const priceNumber =
//               typeof p.price === "number"
//                 ? p.price
//                 : parseFloat(String(p.price || "").replace(/[^\d.-]/g, "")) || 0;
//             return {
//               ...p,
//               image,
//               priceNumber,
//               priceDisplay:
//                 typeof p.price === "string" && p.price.trim()
//                   ? p.price
//                   : `RS. ${priceNumber.toFixed(2)}`,
//             };
//           });

//           if (!signal.aborted) {
//             setProducts(normalized);
//             setLoading(false);
//           }
//           return;
//         } catch (err) {
//           lastError = err;
//           // try next endpoint
//         }
//       }

//       if (!signal.aborted) {
//         setProducts([]);
//         setLoading(false);
//         setError(lastError ? String(lastError.message || lastError) : "Failed to fetch products");
//       }
//     };

//     fetchProducts();

//     return () => controller.abort();
//   }, []);

//   // clicking a product card: navigate to a detail page
//   const handleCardClick = (product) => {
//     const id = product?.id ?? product?.pk;
//     if (!id) {
//       navigate("/products");
//       return;
//     }
//     navigate(`/productdetails/${id}`);
//   };

//   return (
//     <>
//       <MenuBar productCount={products.length} />

//       <div className="bg-[#EFEFEF] min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
//         {loading && (
//           <div className="text-center py-12 text-sm text-gray-600">Loading products…</div>
//         )}

//         {error && (
//           <div className="text-center py-6 text-sm text-red-600">Error loading products: {error}</div>
//         )}

//         {!loading && !error && products.length === 0 && (
//           <div className="text-center py-12 text-sm text-gray-600">No products found.</div>
//         )}

//         {!loading && !error && products.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-2">
//             {products.map((product) => (
//               <div
//                 key={product.id ?? product.pk}
//                 onClick={() => handleCardClick(product)}
//                 className="group cursor-pointer"
//               >
//                 <div className="bg-white overflow-hidden">
//                   <div className="overflow-hidden aspect-[4/5] relative">
//                     <img
//                       src={product.image || FALLBACK_IMAGE}
//                       alt={product.name}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         e.currentTarget.onerror = null;
//                         e.currentTarget.src = FALLBACK_IMAGE;
//                       }}
//                     />
//                   </div>
//                   <div className="p-3 bg-[#efefef]">
//                     <h3 className="text-xs font-medium text-gray-900">{product.name}</h3>
//                     <p className="text-xs text-gray-600 mt-1">{product.priceDisplay}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AllProducts;


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = (typeof window !== "undefined" && window.__API_BASE__) || "https://api.elfamor.com";
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

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/\//.test(url)) return `${window.location.protocol}${url}`;
  if (url.startsWith("/")) return `${API_BASE.replace(/\/$/, "")}${url}`;
  return `${API_BASE.replace(/\/$/, "")}/${url}`;
};

const AllProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter and sort states
  const [size, setSize] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [tempSize, setTempSize] = useState("All");
  const [tempAvailability, setTempAvailability] = useState("All");
  const [tempSort, setTempSort] = useState("Featured");

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const brandQuery = searchParams.get('brand') || '';

  // Fetch products
  useEffect(() => {
    const controller = new AbortController();
    const endpoints = [
      `${API_BASE}/api/products/products/`,
      // `${API_BASE}/api/products/`,
      // `${API_BASE}/products/`,
      // `${API_BASE}/api/products-list/`,
    ];

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });

          if (!res.ok) continue;

          const data = await res.json();
          const items = Array.isArray(data) ? data : data.results || [];
          
          const normalized = items.map((p) => {
            const rawImage = getProductImage(p);
            const image = normalizeImageUrl(rawImage) || FALLBACK_IMAGE;
            const priceNumber = typeof p.price === "number" ? p.price : parseFloat(String(p.price || "").replace(/[^\d.-]/g, "")) || 0;
            
            return {
              ...p,
              image,
              priceNumber,
              priceDisplay: typeof p.price === "string" && p.price.trim() ? p.price : `RS. ${priceNumber.toFixed(2)}`,
              // Add default values for filtering
              size: p.size || "100 ml", // Default size if not provided
              inStock: p.stock !== undefined ? p.stock > 0 : true, // Default to in stock if not provided
              created_at: p.created_at || new Date().toISOString() // Default creation date
            };
          });

          if (!controller.signal.aborted) {
            setProducts(normalized);
            setLoading(false);
            return;
          }
        } catch (err) {
          continue;
        }
      }

      if (!controller.signal.aborted) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // Filter and sort products - FIXED LOGIC
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    console.log("Applying filters:", { size, availability, sort, searchQuery, brandQuery });

    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => {
        const matchesSearch = 
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        console.log(`Product ${product.name} search match:`, matchesSearch);
        return matchesSearch;
      });
    }

    // Apply brand filter
    if (brandQuery) {
      filtered = filtered.filter(product => {
        const matchesBrand = product.brand?.toLowerCase().includes(brandQuery.toLowerCase());
        console.log(`Product ${product.name} brand match:`, matchesBrand);
        return matchesBrand;
      });
    }

    // Apply size filter - FIXED
    if (size !== "All") {
      filtered = filtered.filter(product => {
        const productSize = product.size?.toString().toLowerCase() || "";
        const filterSize = size.toLowerCase();
        const matchesSize = productSize.includes(filterSize);
        console.log(`Product ${product.name} size match:`, matchesSize, `(Product: ${productSize}, Filter: ${filterSize})`);
        return matchesSize;
      });
    }

    // Apply availability filter - FIXED
    if (availability !== "All") {
      filtered = filtered.filter(product => {
        let matchesAvailability = true;
        if (availability === "InStock") {
          matchesAvailability = product.inStock === true;
        } else if (availability === "OutOfStock") {
          matchesAvailability = product.inStock === false;
        }
        console.log(`Product ${product.name} availability match:`, matchesAvailability, `(inStock: ${product.inStock})`);
        return matchesAvailability;
      });
    }

    console.log("Products after filtering:", filtered.length);

    // Apply sorting - FIXED
    const sorted = [...filtered].sort((a, b) => {
      console.log(`Sorting by: ${sort}`);
      switch (sort) {
        case "Price: Low to High":
          return a.priceNumber - b.priceNumber;
        case "Price: High to Low":
          return b.priceNumber - a.priceNumber;
        case "Newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "Featured":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    console.log("Final sorted products:", sorted.length);
    setFilteredProducts(sorted);
  }, [products, searchQuery, brandQuery, size, availability, sort]);

  // Modal functions
  const applyFilters = () => {
    console.log("Applying filters from modal:", { tempSize, tempAvailability, tempSort });
    setSize(tempSize);
    setAvailability(tempAvailability);
    setSort(tempSort);
    setIsFilterModalOpen(false);
  };

  const removeAllFilters = () => {
    console.log("Removing all filters");
    setTempSize("All");
    setTempAvailability("All");
    setTempSort("Featured");
    setSize("All");
    setAvailability("All");
    setSort("Featured");
    setIsFilterModalOpen(false);
  };

  const closeModal = () => {
    setTempSize(size);
    setTempAvailability(availability);
    setTempSort(sort);
    setIsFilterModalOpen(false);
  };

  const handleCardClick = (product) => {
    const id = product?.id ?? product?.pk;
    navigate(id ? `/productdetails/${id}` : "/products");
  };

  const displayProducts = filteredProducts;

  return (
    <>
      {/* Menu Bar */}
      <div className="text-xs bg-[#EFEFEF]">
        <div className="relative font-medium text-xs p-5 mt-21 md:px-10 text-gray-900 bg-[#EFEFEF]">ALL PRODUCTS</div>
        <div className="px-10 filter-bar hidden sm:flex bg-[#EFEFEF] justify-between items-center py-4">
          <div className="filter-options flex gap-6">
            <label className="text-gray-700 text-xs flex items-center gap-2">
              FILTER:
              <select 
                className="text-gray-700 hover:cursor-pointer border border-gray-300 px-2 py-1"
                value={size} 
                onChange={e => setSize(e.target.value)}
              >
                <option value="All">All Sizes</option>
                <option value="100 ml">50 ml</option>
              </select>
            </label>
            <label className="text-gray-700 text-xs flex items-center gap-2">
              <select 
                className="text-gray-700 hover:cursor-pointer border border-gray-300 px-2 py-1"
                value={availability} 
                onChange={e => setAvailability(e.target.value)}
              >
                <option value="All">All Items</option>
                <option value="InStock">In Stock</option>
                <option value="OutOfStock">Out of Stock</option>
              </select>
            </label>
          </div>
          <div className="sort-group text-xs flex items-center gap-4">
            <label className="text-gray-700 flex items-center gap-2">
              SORT BY:
              <select 
                className="text-gray-700 hover:cursor-pointer border border-gray-300 px-2 py-1"
                value={sort} 
                onChange={e => setSort(e.target.value)}
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest">Newest</option>
              </select>
            </label>
            <span className="product-count text-gray-700">
              {displayProducts.length} PRODUCTS
            </span>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-black text-white z-30">
          <button
            className="w-full py-4 text-center text-sm font-medium tracking-wider"
            onClick={() => setIsFilterModalOpen(true)}
          >
            FILTER AND SORT
          </button>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 bg-[#EFEFEF] z-50 lg:hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-center flex-1">
                <h2 className="text-sm font-medium text-gray-900">FILTER AND SORT</h2>
                <p className="text-xs text-gray-500 mt-1">{displayProducts.length} PRODUCTS</p>
              </div>
              <button onClick={closeModal} className="text-2xl text-gray-700 hover:text-gray-900">×</button>
            </div>

            <div className="p-6 space-y-8">
              <div className="border-b pb-2">
                <h3 className="text-xs font-medium text-gray-900 mb-2">SIZE</h3>
                <select
                  className="w-full p-3 text-xs bg-white border border-gray-300 rounded"
                  value={tempSize}
                  onChange={e => setTempSize(e.target.value)}
                >
                  <option value="All">All Sizes</option>
                  <option value="100 ml">50 ml</option>
                </select>
              </div>

              <div className="border-b pb-2">
                <h3 className="text-sm font-medium text-gray-900 mb-4">AVAILABILITY</h3>
                <select
                  className="w-full p-3 text-xs bg-white border border-gray-300 rounded"
                  value={tempAvailability}
                  onChange={e => setTempAvailability(e.target.value)}
                >
                  <option value="All">All Items</option>
                  <option value="InStock">In Stock</option>
                  <option value="OutOfStock">Out of Stock</option>
                </select>
              </div>

              <div className="border-b pb-2">
                <h3 className="text-sm font-medium text-gray-900 mb-4">SORT BY:</h3>
                <select
                  className="w-full p-3 text-sm bg-white border border-gray-300 rounded"
                  value={tempSort}
                  onChange={e => setTempSort(e.target.value)}
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to Low</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#EFEFEF] border-t">
              <div className="flex gap-4">
                <button
                  onClick={removeAllFilters}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded"
                >
                  REMOVE ALL
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 bg-black text-white text-sm font-medium rounded"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Content */}
      <div className="bg-[#EFEFEF] min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Search/Brand Results Header */}
        {(searchQuery || brandQuery) && (
          <div className="mb-6 text-center">
            <h1 className="text-lg font-medium text-gray-900">
              {searchQuery && `Search Results for "${searchQuery}"`}
              {searchQuery && brandQuery && " in "}
              {brandQuery && `Brand: ${brandQuery}`}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Found {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-sm text-gray-600">Loading products…</div>
        )}

        {error && (
          <div className="text-center py-6 text-sm text-red-600">{error}</div>
        )}

        {!loading && !error && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery || brandQuery || size !== "All" || availability !== "All" 
                ? "No products found matching your criteria." 
                : "No products found."}
            </p>
            {(searchQuery || brandQuery || size !== "All" || availability !== "All") && (
              <button
                onClick={removeAllFilters}
                className="text-xs bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                View All Products
              </button>
            )}
          </div>
        )}

        {!loading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-2">
            {displayProducts.map((product) => (
              <div
                key={product.id ?? product.pk}
                onClick={() => handleCardClick(product)}
                className="group cursor-pointer"
              >
                <div className="bg-white overflow-hidden">
                  <div className="overflow-hidden aspect-[4/5] relative">
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="pt-3 bg-[#efefef]">
                    <h3 className="text-xs font-medium text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{product.discounted_price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllProducts;