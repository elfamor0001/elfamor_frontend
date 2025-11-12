// // import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// // const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
// // const AppContext = createContext();

// // export const AppProvider = ({ children }) => {
// //   // --- cartCount (kept for backward compat) ---
// //   const [cartCount, setCartCount] = useState(() => {
// //     const saved = localStorage.getItem("cartCount");
// //     return saved ? parseInt(saved, 10) : 0;
// //   });

// //   useEffect(() => {
// //     localStorage.setItem("cartCount", String(cartCount));
// //   }, [cartCount]);

// //   // --- cartItems (single source of truth) ---
// //   const [cartItems, setCartItems] = useState(() => {
// //     try {
// //       const saved = localStorage.getItem("cartItems");
// //       return saved ? JSON.parse(saved) : [];
// //     } catch {
// //       return [];
// //     }
// //   });

// //   // keep cartCount synced with cartItems
// //   useEffect(() => {
// //     try {
// //       const totalQty = (cartItems || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
// //       setCartCount(totalQty);
// //       localStorage.setItem("cartItems", JSON.stringify(cartItems));
// //     } catch (err) {
// //       console.warn("Failed to sync cartItems:", err);
// //     }
// //   }, [cartItems]);

// //   // --- toast system ---
// //   const [toastMessage, setToastMessage] = useState("");
// //   const [toastVisible, setToastVisible] = useState(false);
// //   // keep a ref-like timer id via closure
// //   let toastTimer = null;
// //   const showToast = (msg, ms = 2000) => {
// //     setToastMessage(msg);
// //     setToastVisible(true);
// //     if (toastTimer) clearTimeout(toastTimer);
// //     toastTimer = setTimeout(() => setToastVisible(false), ms);
// //   };

// //   // --- products state and fetchers ---
// //   const [products, setProducts] = useState(() => {
// //     try {
// //       const saved = localStorage.getItem("products_cache_v1");
// //       return saved ? JSON.parse(saved) : [];
// //     } catch {
// //       return [];
// //     }
// //   });
// //   const [productsLoading, setProductsLoading] = useState(false);
// //   const [productsError, setProductsError] = useState(null);
// //   const [productsFetchedAt, setProductsFetchedAt] = useState(() => {
// //     const saved = localStorage.getItem("products_fetched_at_v1");
// //     return saved ? Number(saved) : 0;
// //   });

// //   // fetch list of products. Accepts optional query for search or filters.
// //   const fetchProducts = useCallback(
// //     async (options = { force: false, query: "" }) => {
// //       const { force = false, query = "" } = options || {};
// //       // simple caching: if recently fetched and not forced, use cache
// //       const now = Date.now();
// //       const cacheTTL = 1000 * 60 * 5; // 5 minutes
// //       if (!force && products && products.length > 0 && now - (productsFetchedAt || 0) < cacheTTL) {
// //         return products;
// //       }

// //       setProductsLoading(true);
// //       setProductsError(null);

// //       try {
// //         // build url (adjust backend endpoint to your API)
// //         const url = new URL(`${API_BASE}/api/products/`);
// //         if (query) url.searchParams.set("q", query);

// //         const res = await fetch(url.toString(), { credentials: "include" });
// //         if (!res.ok) {
// //           throw new Error(`Failed to fetch products: ${res.status}`);
// //         }
// //         const data = await res.json();
// //         // Expecting data to be an array of products - adapt if backend differs
// //         const list = Array.isArray(data) ? data : data.results || [];
// //         setProducts(list);
// //         setProductsFetchedAt(Date.now());
// //         try {
// //           localStorage.setItem("products_cache_v1", JSON.stringify(list));
// //           localStorage.setItem("products_fetched_at_v1", String(Date.now()));
// //         } catch {}
// //         return list;
// //       } catch (err) {
// //         console.error("fetchProducts error:", err);
// //         setProductsError(err.message || "Failed to fetch products");
// //         return [];
// //       } finally {
// //         setProductsLoading(false);
// //       }
// //     },
// //     [products, productsFetchedAt]
// //   );

// //   // helper: fetch single product by id (tries cache first)
// //   const getProductById = useCallback(
// //     async (id, { force = false } = {}) => {
// //       if (!id) return null;
// //       const cached = (products || []).find((p) => String(p.id) === String(id));
// //       if (cached && !force) return cached;

// //       try {
// //         const res = await fetch(`${API_BASE}/api/products/${id}/`, { credentials: "include" });
// //         if (!res.ok) {
// //           // fallback to cached if exists
// //           if (cached) return cached;
// //           throw new Error("Failed to fetch product");
// //         }
// //         const data = await res.json();
// //         // update local products cache
// //         setProducts((prev) => {
// //           const exists = prev.find((p) => String(p.id) === String(id));
// //           if (exists) return prev.map((p) => (String(p.id) === String(id) ? data : p));
// //           return [data, ...prev];
// //         });
// //         return data;
// //       } catch (err) {
// //         console.warn("getProductById error:", err);
// //         return cached || null;
// //       }
// //     },
// //     [products]
// //   );

// //   // --- cart operations ---
// //   const addToCart = (productOrId, qty = 1) => {
// //     // Accept either product object or product id (will create minimal product shape if only id)
// //     const qtyNum = Number(qty) || 1;
// //     if (!productOrId) {
// //       console.warn("addToCart: missing argument");
// //       return;
// //     }

// //     // if productOrId is an id, try to find product from cache
// //     let product = null;
// //     if (typeof productOrId === "string" || typeof productOrId === "number") {
// //       product = (products || []).find((p) => String(p.id) === String(productOrId)) || { id: productOrId, name: "Product", price: 0 };
// //     } else if (typeof productOrId === "object") {
// //       product = productOrId;
// //     }

// //     if (!product || !product.id) {
// //       console.warn("addToCart: product must have an id");
// //       return;
// //     }

// //     setCartItems((prev) => {
// //       const existing = prev.find((p) => String(p.id) === String(product.id));
// //       if (existing) {
// //         return prev.map((p) =>
// //           String(p.id) === String(product.id) ? { ...p, quantity: (Number(p.quantity) || 0) + qtyNum } : p
// //         );
// //       }
// //       // construct minimal cart item (keep extra fields if present)
// //       const newItem = {
// //         id: product.id,
// //         name: product.name || product.title || "Product",
// //         price: Number(product.price) || Number(product.cost) || 0,
// //         image: product.image || product.thumbnail || "",
// //         size: product.size || "",
// //         quantity: qtyNum,
// //         // include any other fields if provided
// //         ...(product.sku ? { sku: product.sku } : {}),
// //       };
// //       return [...prev, newItem];
// //     });

// //     showToast("Added to cart");
// //   };

// //   const removeFromCart = (id) => {
// //     setCartItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
// //   };

// //   const updateQuantity = (id, newQty) => {
// //     const n = Number(newQty) || 0;
// //     if (n <= 0) {
// //       removeFromCart(id);
// //       return;
// //     }
// //     setCartItems((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, quantity: n } : p)));
// //   };

// //   // attemptOpenCart: pass callback that navigates/opens cart UI
// //   const attemptOpenCart = (openCallback) => {
// //     const hasItems = Array.isArray(cartItems) ? cartItems.length > 0 : !!cartCount;
// //     if (!hasItems) {
// //       showToast("Cart is empty");
// //       return false;
// //     }
// //     if (typeof openCallback === "function") openCallback();
// //     return true;
// //   };

// //   const resetCart = () => {
// //     setCartItems([]);
// //     setCartCount(0);
// //   };

// //   // --- small utility: format price safely (avoid undefined errors in UI) ---
// //   const formatPrice = (value, opts = { currency: "INR", prefix: "RS. " }) => {
// //     const num = Number(value) || 0;
// //     // using toLocaleString is OK because num is numeric
// //     try {
// //       return `${opts.prefix}${num.toLocaleString()}`;
// //     } catch {
// //       return `${opts.prefix}${num}`;
// //     }
// //   };

// //   // --- on mount: attempt to fetch products in background (non-blocking) ---
// //   useEffect(() => {
// //     // If there are no products in cache, fetch once
// //     if (!products || products.length === 0) {
// //       fetchProducts().catch(() => {});
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // provider value
// //   const value = {
// //     // cart
// //     cartCount,
// //     cartItems,
// //     addToCart,
// //     removeFromCart,
// //     updateQuantity,
// //     resetCart,
// //     attemptOpenCart,
// //     showToast,
// //     // products
// //     products,
// //     productsLoading,
// //     productsError,
// //     productsFetchedAt,
// //     fetchProducts,
// //     getProductById,
// //     // utilities
// //     formatPrice,
// //   };

// //   return (
// //     <AppContext.Provider value={value}>
// //       {children}

// //       {/* Toast UI */}
// //       {toastVisible && (
// //         <div
// //           className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[99999] px-4 py-2 rounded-md text-sm shadow-md"
// //           style={{
// //             background: "rgba(0,0,0,0.85)",
// //             color: "white",
// //             maxWidth: "90%",
// //           }}
// //           role="status"
// //           aria-live="polite"
// //         >
// //           {toastMessage}
// //         </div>
// //       )}
// //     </AppContext.Provider>
// //   );
// // };

// // export const useAppContext = () => useContext(AppContext);

// // export default AppContext;


// // AppContext.jsx — replace your current file with this (keeps your existing logic)
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   // Cart count (kept from your original)
//   const [cartCount, setCartCount] = useState(() => {
//     const saved = localStorage.getItem("cartCount");
//     return saved ? parseInt(saved, 10) : 0;
//   });

//   useEffect(() => {
//     localStorage.setItem("cartCount", cartCount);
//   }, [cartCount]);

//   // cartItems (single source of truth)
//   const [cartItems, setCartItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem("cartItems");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     // keep cartCount in sync
//     const totalQty = (cartItems || []).reduce((s, it) => s + (it.quantity || 0), 0);
//     setCartCount(totalQty);
//   }, [cartItems]);

//   // PREVIEW: temporary badge delta while user is on product page changing quantity
//   const [previewDelta, setPreviewDelta] = useState(0);
//   // previewDelta is an integer (can be negative). Navbar will display cartCount + previewDelta.

//   // Simple toast system
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const showToast = (msg, ms = 2000) => {
//     setToastMessage(msg);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), ms);
//   };

//   // Exposed cart operations
//   const addToCart = (product, qty = 1) => {
//     if (!product || !product.id) {
//       console.warn("addToCart: product must be an object with id");
//       return;
//     }

//     setCartItems((prev) => {
//       const existing = prev.find((p) => p.id === product.id);
//       if (existing) {
//         return prev.map((p) =>
//           p.id === product.id ? { ...p, quantity: (p.quantity || 0) + Number(qty) } : p
//         );
//       }
//       return [...prev, { ...product, quantity: Number(qty) }];
//     });

//     // after actually adding, clear preview delta — real cartCount will update via useEffect above
//     setPreviewDelta(0);
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((p) => p.id !== id));
//   };

//   const updateQuantity = (id, newQty) => {
//     if (newQty <= 0) {
//       removeFromCart(id);
//       return;
//     }
//     setCartItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p)));
//   };

//   // attemptOpenCart: safe check both cartItems and cartCount
//   const attemptOpenCart = (openCallback) => {
//     // NOTE: check both to avoid false negatives if one is out-of-sync
//     const hasItems = (cartItems && cartItems.length > 0) || (cartCount && cartCount > 0);
//     if (!hasItems) {
//       showToast("Cart is empty");
//       return false;
//     }
//     if (typeof openCallback === "function") openCallback();
//     return true;
//   };

//   const resetCart = () => {
//     setCartItems([]);
//     setCartCount(0);
//     setPreviewDelta(0);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         cartCount,
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         resetCart,
//         attemptOpenCart,
//         showToast,
//         previewDelta,
//         setPreviewDelta, // expose setter so pages can update the preview
//       }}
//     >
//       {children}

//       {/* Toast UI */}
//       {toastVisible && (
//         <div
//           className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[99999] px-4 py-2 rounded-md text-sm shadow-md"
//           style={{
//             background: "rgba(0,0,0,0.85)",
//             color: "white",
//             maxWidth: "90%",
//           }}
//         >
//           {toastMessage}
//         </div>
//       )}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);