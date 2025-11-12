import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCSRFToken } from '../context/authUtils.js';

// prefer an imported fallback so bundlers (CRA/Vite) resolve it correctly
import FALLBACK_IMG from "../assets/logo.png";

const API_BASE =
  (typeof window !== "undefined" && window.__API_BASE__) || "https://elfamor.pythonanywhere.com";

const FALLBACK_IMAGE = FALLBACK_IMG || "/logo.png";

// Helper to normalize relative urls returned by backend
function normalizeImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/\//.test(url)) return `${window.location.protocol}${url}`;
  if (url.startsWith("/")) return `${API_BASE.replace(/\/$/, "")}${url}`;
  return `${API_BASE.replace(/\/$/, "")}/${url}`;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [itemActionLoading, setItemActionLoading] = useState(false);

  // NEW: suggested products state
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [suggestedError, setSuggestedError] = useState("");

  const prevQtyRef = useRef(0);

  useEffect(() => {
    // Simpler fetch flow (same as your working ProductDetailPage):
    // 1) GET product from /api/products/products/{id}/
    // 2) if product.images is missing/empty, GET /api/product-images/?product_id={id}
    // This is intentionally simpler and more robust for your backend shape.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/products/products/${id}/`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal,
        });

        if (!res.ok) {
          // handle non-OK
          const txt = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} - ${txt.slice(0, 200)}`);
        }

        const productData = await res.json();

        // If images aren't included in the main product response, fetch them separately
        if (!productData.images || productData.images.length === 0) {
          try {
            const imagesRes = await fetch(`${API_BASE}/api/product-images/?product_id=${id}`, {
              method: "GET",
              credentials: "include",
              headers: { Accept: "application/json" },
              signal,
            });
            if (imagesRes.ok) {
              const imagesData = await imagesRes.json();
              productData.images = imagesData.results || imagesData || [];
            }
          } catch (imgErr) {
            // don't fail entire product load if image endpoint fails; just leave images absent
            // eslint-disable-next-line no-console
            console.warn("product images fetch failed:", imgErr);
          }
        }

        if (!signal.aborted) {
          setProduct(productData);
          setCurrentImageIndex(0);
        }
      } catch (err) {
        if (!signal.aborted) {
          // eslint-disable-next-line no-console
          console.error("Error fetching product:", err);
          setError(err.message || "Failed to fetch product");
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => controller.abort();
  }, [id]);

  // NEW: fetch suggested products (random 4)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const endpoints = [
      `${API_BASE}/api/products/products/`,
      // `${API_BASE}/api/products/`,
      // `${API_BASE}/products/`,
      // `${API_BASE}/api/products-list/`,
    ];

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
      let data;
      try {
        data = await res.json();
      } catch (err) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Invalid JSON from ${ep}: ${txt.slice(0, 300)}`);
      }
      return Array.isArray(data) ? data : data.results || [];
    };

    const pickRandom = (arr, n = 4) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      // Fisher-Yates shuffle (in a copy)
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    };

    // derive image URL for a product object (mirrors other logic)
    const deriveProductImage = (p) => {
      if (!p) return FALLBACK_IMAGE;
      if (p.primary_image) {
        if (typeof p.primary_image === "string") return normalizeImageUrl(p.primary_image) || FALLBACK_IMAGE;
        if (p.primary_image.url) return normalizeImageUrl(p.primary_image.url) || FALLBACK_IMAGE;
        if (p.primary_image.image) return normalizeImageUrl(p.primary_image.image) || FALLBACK_IMAGE;
      }
      if (Array.isArray(p.images) && p.images.length > 0) {
        const primary = p.images.find((i) => i.is_primary) || p.images[0];
        if (typeof primary === "string") return normalizeImageUrl(primary) || FALLBACK_IMAGE;
        const raw = primary.image || primary.url || primary.image_url || primary.path || primary.file;
        return normalizeImageUrl(raw) || FALLBACK_IMAGE;
      }
      if (p.image) return normalizeImageUrl(p.image) || FALLBACK_IMAGE;
      if (p.main_image) return normalizeImageUrl(p.main_image) || FALLBACK_IMAGE;
      if (p.image_url) return normalizeImageUrl(p.image_url) || FALLBACK_IMAGE;
      return FALLBACK_IMAGE;
    };

    const fetchSuggested = async () => {
      setSuggestedLoading(true);
      setSuggestedError("");
      setSuggestedProducts([]);
      let lastErr = null;
      // try endpoints in parallel but use Promise.any so the fastest successful one is used
      const tries = endpoints.map((ep) => fetchEndpoint(ep).catch((e) => { throw e; }));
      try {
        // Promise.any returns first fulfilled result
        const items = await Promise.any(tries);
        const picked = pickRandom(items, 4).map((p) => ({
          ...p,
          _image: deriveProductImage(p),
        }));
        if (!signal.aborted) {
          setSuggestedProducts(picked);
          setSuggestedLoading(false);
        }
      } catch (err) {
        // Promise.any failed -> try endpoints sequentially as fallback to collect errors
        try {
          for (const ep of endpoints) {
            try {
              const items = await fetchEndpoint(ep);
              const picked = pickRandom(items, 4).map((p) => ({ ...p, _image: deriveProductImage(p) }));
              if (!signal.aborted) {
                setSuggestedProducts(picked);
                setSuggestedLoading(false);
              }
              return;
            } catch (e) {
              lastErr = e;
              continue;
            }
          }
          throw lastErr || new Error("No product endpoints returned data");
        } catch (finalErr) {
          if (!signal.aborted) {
            // eslint-disable-next-line no-console
            console.error("Suggested products fetch failed:", finalErr);
            setSuggestedError(finalErr.message || "Failed to fetch suggested products");
            setSuggestedLoading(false);
            setSuggestedProducts([]);
          }
        }
      }
    };

    fetchSuggested();

    return () => controller.abort();
  }, []); // run once

  // set prev qty only once product is available
  useEffect(() => {
    if (!product) return;
    // const existing = cartItems.find((p) => Number(p.id) === Number(product.id));
    // prevQtyRef.current = existing ? existing.quantity || 0 : 0;

    if (typeof setPreviewDelta === "function") setPreviewDelta(0);
    return () => {
      if (typeof setPreviewDelta === "function") setPreviewDelta(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // update preview delta when quantity changes (only if product is loaded)
  useEffect(() => {
    if (typeof setPreviewDelta !== "function" || !product) return;
    const existing = cartItems.find((p) => Number(p.id) === Number(product.id));
    const existingQty = existing ? existing.quantity || 0 : 0;
    setPreviewDelta(quantity - existingQty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, product]);

  const increment = () => setQuantity((q) => Math.min(10, q + 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  // Enhanced Add to Cart functionality from first code
 const handleAddToCart = () => {
    // Add to cart logic: POST to backend cart endpoint
    (async () => {
      try {
        const csrfToken = await getCSRFToken();
        const res = await fetch('https://elfamor.pythonanywhere.com/api/cart/add/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({ product_id: product.id, quantity }),
        });

        if (res.ok) {
          const data = await res.json();
          // Simple feedback: console and navigate to cart if desired
          console.log('Added to cart', data);
          // Optionally navigate to cart or show a toast
          // navigate('/cart');
          alert(`Added ${quantity} x ${product.name} to cart`);
        } else if (res.status === 401) {
          // Not authenticated
          alert('Please log in to add items to your cart');
          navigate('/auth');
        } else {
          const err = await res.json().catch(() => null);
          console.error('Failed to add to cart', err);
          alert((err && err.error) || 'Failed to add item to cart');
        }
      } catch (err) {
        console.error('Add to cart error', err);
        alert('Could not add item to cart — check console for details');
      }
    })();
  };

  const navigateToAllProducts = () => navigate("/products");

  if (!id) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] p-6">
        <div className="text-red-600 mb-4">Invalid product URL (missing id).</div>
        <button onClick={navigateToAllProducts} className="px-3 py-2 bg-black text-white rounded">
          Back to products
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] p-4 flex justify-center items-center">
        <div className="animate-pulse">Loading product…</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] p-6">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button onClick={navigateToAllProducts} className="px-3 py-2 bg-black text-white rounded">
          Back to products
        </button>
        <div className="mt-6 text-sm text-gray-600">
          Note: If the browser console shows CORS errors (no Access-Control-Allow-Origin), enable your frontend origin in Django's CORS settings (or allow all origins for dev).
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] p-6">
        <div>No product found.</div>
        <button onClick={navigateToAllProducts} className="mt-4 px-3 py-2 bg-black text-white rounded">
          Back to products
        </button>
      </div>
    );
  }

  // helper to get a thumbnail src for an image object returned by your backend
  const thumbSrc = (imgObj) => {
    if (!imgObj) return FALLBACK_IMAGE;
    // prefer common fields then normalize if needed
    const raw = imgObj.image_url || imgObj.image || imgObj.url || imgObj.path || imgObj.file || imgObj.media;
    return normalizeImageUrl(raw) || FALLBACK_IMAGE;
  };

  // get main displayed image (from product.images based on currentImageIndex)
  const getDisplayedSrc = () => {
    if (product.images && product.images.length > 0) {
      const chosen = product.images[currentImageIndex] || product.images[0];
      return thumbSrc(chosen);
    }
    // fallback to product-level image fields if present
    const raw =
      product.primary_image?.url ||
      product.primary_image?.image ||
      product.primary_image ||
      product.image ||
      product.main_image ||
      product.image_url;
    return normalizeImageUrl(raw) || FALLBACK_IMAGE;
  };

  const imgs = (product.images && product.images.length > 0)
    ? product.images
    : [
        // if no images array, attempt to derive from product-level fields
        { id: "primary", image_url: product.primary_image?.url || product.primary_image || product.image || product.image_url || product.main_image }
      ];

  const displayed = getDisplayedSrc();

  return (
    <div className="min-h-screen bg-[#efefef] text-sm lg:py-12 mt-21">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_500px] gap-6 items-start">
          {/* Thumbnails: vertical on lg, horizontal on mobile */}
          <div className="order-2 lg:order-1">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible py-2">
              {imgs.map((imgObj, idx) => (
                <button
                  key={imgObj.id ?? idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 p-1 rounded-md overflow-hidden border ${idx === currentImageIndex ? "border-gray-800" : "border-gray-200"}`}
                >
                  <img
                    src={thumbSrc(imgObj)}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main image */}
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="w-full max-h-[80vh] flex items-center justify-center bg-[#efefef] py-4 rounded">
              <img
                src={displayed}
                alt="main"
                className="max-h-[80vh] max-w-full object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="order-3 lg:order-3">
            <div className="space-y-4 px-2 py-4 lg:p-6 bg-[#efefef] rounded">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  {product.volume_ml && <h4 className="text-sm text-gray-400 mt-1">{product.volume_ml}ml</h4>}
                </div>
                <div className="mt-1">
                  <div className="sm:text-md lg:text-lg font-semibold">RS. {product.price ?? product.price_display ?? "—"}</div>
                </div>
              </div>

              {/* Enhanced Action Buttons from first code */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={itemActionLoading}
                  className={`flex-1 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300 ${
                    itemActionLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {itemActionLoading ? 'ADDING...' : 'ADD TO CART'}
                </button>

                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={decrement} 
                    disabled={itemActionLoading}
                    className="px-3 py-2 bg-gray-100 rounded-l-md hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <div className="px-4 py-2 font-medium">{quantity}</div>
                  <button 
                    onClick={increment} 
                    disabled={itemActionLoading}
                    className="px-3 py-2 bg-gray-100 rounded-r-md hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{product.description || "No description available."}</p>
              </div>

              <div className="space-y-4">
                {product.top_notes?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Top Notes</h3>
                    <div className="flex flex-wrap gap-2">{product.top_notes.map((n) => <span key={n.id} className="text-xs bg-gray-200 px-2 py-1 rounded">{n.name}</span>)}</div>
                  </div>
                )}
                {product.heart_notes?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Heart Notes</h3>
                    <div className="flex flex-wrap gap-2">{product.heart_notes.map((n) => <span key={n.id} className="text-xs bg-gray-200 px-2 py-1 rounded">{n.name}</span>)}</div>
                  </div>
                )}
                {product.base_notes?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Base Notes</h3>
                    <div className="flex flex-wrap gap-2">{product.base_notes.map((n) => <span key={n.id} className="text-xs bg-gray-200 px-2 py-1 rounded">{n.name}</span>)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested */}
        <div className="bg-[#EFEFEF] py-6 mt-8 rounded">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs text-gray-700">YOU MAY ALSO LIKE</h2>
            <button onClick={navigateToAllProducts} className="text-xs bg-white font-medium text-gray-700 p-1 px-2">DISCOVER MORE</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
            {suggestedLoading ? (
              // skeletons while loading
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 bg-gray-200 animate-pulse rounded" />
              ))
            ) : suggestedError ? (
              <div className="col-span-2 lg:col-span-4 text-center text-red-600">
                {suggestedError}
              </div>
            ) : suggestedProducts.length === 0 ? (
              // fallback UI if none found
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="overflow-hidden mb-4 aspect-[4/5] relative bg-white">
                    <img src={FALLBACK_IMAGE} className="w-full h-full object-cover" alt={`also-${i}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide">PRODUCT NAME</h3>
                    <p className="text-xs text-gray-600">RS. 3,995</p>
                  </div>
                </div>
              ))
            ) : (
              // render suggested products fetched from backend
              suggestedProducts.map((p) => (
                <div key={p.id ?? p.pk ?? Math.random()} className="group cursor-pointer" onClick={() => {
                  const pid = p.id ?? p.pk;
                  if (pid) navigate(`/productdetails/${pid}`);
                }}>
                  <div className="overflow-hidden mb-4 aspect-[4/5] relative bg-white">
                    <img src={p._image || FALLBACK_IMAGE} className="w-full h-full object-cover" alt={p.name || "product"} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide">{p.name || "Product"}</h3>
                    <p className="text-xs text-gray-600">{p.price ?? p.price_display ?? ""}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;