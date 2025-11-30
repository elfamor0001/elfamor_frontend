// import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import { getCSRFToken } from "./authUtils.js";

// const API_BASE = "https://elfamor.pythonanywhere.com";
// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// async function fetchWithTimeout(url, options = {}, timeout = 8000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//   try {
//     const res = await fetch(url, { ...options, signal: controller.signal });
//     clearTimeout(id);
//     return res;
//   } catch (err) {
//     clearTimeout(id);
//     throw err;
//   }
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const mountedRef = useRef(true);

//   const checkSession = async () => {
//     if (!mountedRef.current) return null;
    
//     try {
//       const res = await fetchWithTimeout(`${API_BASE}/accounts/session_view/`, {
//         credentials: "include",
//         headers: { Accept: "application/json" },
//       }, 8000);

//       if (res.status === 200) {
//         let data = null;
//         try {
//           const txt = await res.text().catch(() => "");
//           data = txt ? JSON.parse(txt) : null;
//         } catch (err) {
//           data = null;
//         }

//         if (mountedRef.current) {
//           if (data && data.user) {
//             setUser(data.user);
//             return data.user;
//           } else {
//             setUser(null);
//             return null;
//           }
//         }
//       } else {
//         if (mountedRef.current) setUser(null);
//         return null;
//       }
//     } catch (err) {
//       if (mountedRef.current) {
//         setUser(null);
//       }
//       return null;
//     }
//   };

//   // Check session on mount
//   useEffect(() => {
//     mountedRef.current = true;
    
//     const initializeAuth = async () => {
//       setAuthLoading(true);
//       await checkSession();
//       if (mountedRef.current) {
//         setAuthLoading(false);
//       }
//     };
    
//     initializeAuth();

//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = async () => {
//     try {
//       const csrfToken = await getCSRFToken().catch(() => "");
//       await fetchWithTimeout(`${API_BASE}/accounts/logout/`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
//         },
//         body: JSON.stringify({}),
//       }, 8000);
//     } catch (err) {
//       // ignore network/logout errors
//     } finally {
//       setUser(null);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, authLoading, checkSession }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getCSRFToken } from "./authUtils";

// const API_BASE = "http://localhost:8000";
// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   // Check session on mount
//   useEffect(() => {
//     fetch(`${API_BASE}/accounts/session_view/`, {
//       credentials: "include",
//     })
//       .then((res) => res.ok ? res.json() : null)
//       .then((data) => {
//         if (data && data.user) setUser(data.user);
//         setAuthLoading(false);
//       })
//       .catch(() => setAuthLoading(false));
//   }, []);

//   const login = (userData) => setUser(userData);

// //   const getCSRFToken = async () => {
// //   const res = await fetch(`${API_BASE}/accounts/csrf/`, {
// //     credentials: "include",
// //   });
// //   const data = await res.json();
// //   return data.csrfToken || data.csrf_token || "";
// // };
// const logout = async () => {
//   const csrfToken = await getCSRFToken();
//   await fetch(`${API_BASE}/accounts/logout/`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrfToken,
//     },
//   });
//   // Re-check session to ensure user is really logged out
//   fetch(`${API_BASE}/accounts/session_view/`, {
//     credentials: "include",
//   })
//     .then((res) => res.ok ? res.json() : null)
//     .then((data) => {
//       if (data && data.user) setUser(data.user);
//       else setUser(null);
//     })
//     .catch(() => setUser(null));
// };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, authLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCSRFToken } from "./authUtils.js";
import { calculateShipping } from "./cartUtils.js";
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartState, setCartState] = useState({
    items: [],
    subtotal: 0,
    shipmentCharge: 0,
    total: 0,
    freeShippingEligible: false,
    amountNeeded: 0,
  });

  function updateCartState(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = calculateShipping(subtotal);
    setCartState({
      items,
      subtotal: shipping.subtotal,
      shipmentCharge: shipping.shipmentCharge,
      total: shipping.total,
      freeShippingEligible: shipping.freeShippingEligible,
      amountNeeded: shipping.amountNeeded,
    });
  }

  function addItem(item) {
    const updatedItems = [...cartItems, item];
    setCartItems(updatedItems);
    updateCartState(updatedItems);
  }

  function removeItem(productId) {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    updateCartState(updatedItems);
  }

  function updateQuantity(productId, quantity) {
    const updatedItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    updateCartState(updatedItems);
  }

  return (
    <CartContext.Provider value={{ cartState, addItem, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

const API_BASE = "https://elfamor.pythonanywhere.com"; 
// const API_BASE = "http://localhost:8000"; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const mountedRef = useRef(true);

  const checkSession = async () => {
    if (!mountedRef.current) return null;
    
    try {
      const res = await fetchWithTimeout(`${API_BASE}/accounts/session_view/`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      }, 8000);

      if (res.status === 200) {
        let data = null;
        try {
          const txt = await res.text().catch(() => "");
          data = txt ? JSON.parse(txt) : null;
        } catch (err) {
          data = null;
        }

        if (mountedRef.current) {
          if (data && data.user) {
            setUser(data.user);
            return data.user;
          } else {
            setUser(null);
            return null;
          }
        }
      } else {
        if (mountedRef.current) setUser(null);
        return null;
      }
    } catch (err) {
      if (mountedRef.current) {
        setUser(null);
      }
      return null;
    }
  };

  // Check session on mount
  useEffect(() => {
    mountedRef.current = true;
    
    const initializeAuth = async () => {
      setAuthLoading(true);
      await checkSession();
      if (mountedRef.current) {
        setAuthLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const csrfToken = await getCSRFToken().catch(() => "");
      await fetchWithTimeout(`${API_BASE}/accounts/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({}),
      }, 8000);
    } catch (err) {
      // ignore network/logout errors
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};