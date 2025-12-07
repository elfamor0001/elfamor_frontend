// import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "https://api.elfamor.com";
// // const API_BASE = "http://localhost:8000";

// // Get CSRF token
// const getCSRFToken = async () => {
//   const res = await fetch(`${API_BASE}/accounts/csrf/`, {
//     credentials: "include",
//   });
//   const data = await res.json();
//   return data.csrfToken || data.csrf_token || "";
// };

// const AuthPage = () => {
//   const { user, login } = useAuth();
//   const navigate = useNavigate();
//   const isMounted = useRef(true);

//   const [mode, setMode] = useState("login");
//   const [step, setStep] = useState("phone"); // 'phone', 'code'
//   const [phone, setPhone] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [countdown, setCountdown] = useState(0);
//   const [canResend, setCanResend] = useState(true);

//   // Countdown timer for resend code
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else {
//       setCanResend(true);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   // Reload only on very first visit to the app
//   useEffect(() => {
//     const hasVisited = sessionStorage.getItem('hasVisitedAuth');
    
//     if (!hasVisited) {
//       console.log("🔄 First visit to auth page - reloading...");
//       sessionStorage.setItem('hasVisitedAuth', 'true');
//       window.location.reload();
//     } else {
//       setIsInitialLoad(false);
//     }
//   }, []);

//   useEffect(() => {
//     return () => { isMounted.current = false; };
//   }, []);

//   useEffect(() => {
//     if (user) navigate("/", { replace: true });
//   }, [user, navigate]);

// const validatePhone = (phoneNumber) => {
//   const cleaned = phoneNumber.replace(/\D/g, '');
//   return cleaned.length === 10;
// };

// const formatPhone = (phoneNumber) => {
//   const cleaned = phoneNumber.replace(/\D/g, '');
  
//   // Format as +91 XXXXXXXXXX or XXXXXXXXXX
//   if (cleaned.length === 0) return '';
//   if (cleaned.length <= 5) return cleaned;
//   if (cleaned.length <= 10) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
//   return cleaned.slice(0, 10); // Ensure max 10 digits
// };

// const handlePhoneChange = (e) => {
//   const input = e.target.value;
//   // Allow backspace to work properly
//   if (input.length < phone.length) {
//     setPhone(input);
//     return;
//   }
  
//   const formatted = formatPhone(input);
//   setPhone(formatted);
// };

//   const requestVerificationCode = async () => {
//     if (!validatePhone(phone)) {
//       setError("Please enter a valid 10-digit phone number");
//       return false;
//     }

//     setLoading(true);
//     setError("");
//     setMsg("");

//     try {
//       const csrfToken = await getCSRFToken();
//       console.log("CSRF Token:", csrfToken);
//       const endpoint = "/accounts/send-verification-code/";
      
//       const res = await fetch(`${API_BASE}${endpoint}`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify({ phone: phone.replace(/\s/g, '') }),
//       });

//       const data = await res.json();
      
//       if (!isMounted.current) return false;

//       if (res.ok) {
//         setMsg("Verification code sent to your phone");
//         setStep("code");
//         setCountdown(60); // 60 seconds countdown
//         setCanResend(false);
//         return true;
//       } else {
//         setError(data.error || "Failed to send verification code");
//         return false;
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       return false;
//     } finally {
//       if (isMounted.current) setLoading(false);
//     }
//   };

//   const verifyCodeAndLogin = async () => {
//     if (!verificationCode || verificationCode.length !== 6) {
//       setError("Please enter the 6-digit verification code");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMsg("");

//     try {
//       const csrfToken = await getCSRFToken();
//       const endpoint = "/accounts/phone-login/";
      
//       const res = await fetch(`${API_BASE}${endpoint}`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify({ 
//           phone: phone.replace(/\s/g, ''), 
//           verification_code: verificationCode 
//         }),
//       });

//       const data = await res.json();
      
//       if (!isMounted.current) return;

//       if (res.ok) {
//         setMsg("Login successful!");
//         if (data.user) {
//           login(data.user);
//         }
//       } else {
//         setError(data.error || "Invalid verification code");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//     } finally {
//       if (isMounted.current) setLoading(false);
//     }
//   };

//   const handleRegister = async () => {
//     setLoading(true);
//     setError("");
//     setMsg("");

//     // Validate email
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Invalid email format");
//       setLoading(false);
//       return;
//     }

//     try {
//       const csrfToken = await getCSRFToken();
//       const endpoint = "/accounts/register/";
      
//       const res = await fetch(`${API_BASE}${endpoint}`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         body: JSON.stringify({ 
//           email, 
//           phone: phone.replace(/\s/g, '') 
//         }),
//       });

//       const data = await res.json();
      
//       if (!isMounted.current) return;

//       if (res.ok) {
//         setMsg("Registration successful! Verification code sent to your phone.");
//         setStep("code");
//         setCountdown(60);
//         setCanResend(false);
//       } else {
//         setError(data.error || "Registration failed");
//       }
//     } catch {
//       setError("Network error. Please try again.");
//     } finally {
//       if (isMounted.current) setLoading(false);
//     }
//   };

//   const resendCode = async () => {
//     if (!canResend) return;
    
//     setCanResend(false);
//     setCountdown(60);
//     await requestVerificationCode();
//   };

//   const resetFlow = () => {
//     setStep("phone");
//     setVerificationCode("");
//     setError("");
//     setMsg("");
//   };

//   // Show loading during initial reload
//   if (isInitialLoad) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#efefef] font-sans">
//         <div className="text-center">
//           <div className="font-logo text-5xl mb-4">Elfamor</div>
//           <div className="text-lg">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#efefef] font-sans">
//       <div className="bg-[#efefef] rounded-2xl p-8 mt-24 mb-10 w-full max-w-md border border-[#f3f3f3] shadow-2xl">
//         <div className="flex flex-col items-center mb-6">
//           <span className="font-logo text-5xl mb-2">Elfamor</span>
//         </div>

//         {/* Phone Input Step */}
//         {step === "phone" && (
//           <>
//             <h2 className="text-2xl font-normal mb-2 text-center">
//               {mode === "login" ? "Sign in with Phone" : "Create Account"}
//             </h2>
//             <p className="text-gray-700 text-center mb-6 text-base font-normal">
//               {mode === "login" 
//                 ? "Enter your phone number to receive a verification code" 
//                 : "Enter your phone number to get started"}
//             </p>

//             <div className="space-y-4">
//             <input
//                 type="tel"
//                 placeholder="Phone Number* (10 digits)"
//                 value={phone}
//                 onChange={handlePhoneChange}
//                 required
//                 disabled={loading}
//                 className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-200 text-base placeholder-gray-500"
//                 maxLength={12} // 10 digits + 1 space (XXXXX XXXXX)
//               />
//               {mode === "register" && (
//                 <input
//                   type="email"
//                   placeholder="Email*"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                   className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-200 text-base placeholder-gray-500"
//                 />
//               )}

//               <button
//                 onClick={mode === "login" ? requestVerificationCode : handleRegister}
//                 disabled={loading || !validatePhone(phone) || (mode === "register" && !email)}
//                 className="w-full bg-black text-white rounded-xl py-4 font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Sending..." : mode === "login" ? "Send Code" : "Register & Send Code"}
//               </button>
//             </div>
//           </>
//         )}

//         {/* Verification Code Step */}
//         {step === "code" && (
//           <>
//             <h2 className="text-2xl font-normal mb-2 text-center">
//               Enter Verification Code
//             </h2>
//             <p className="text-gray-700 text-center mb-6 text-base font-normal">
//               We sent a 6-digit code to {phone}
//             </p>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit code"
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                 required
//                 disabled={loading}
//                 className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-center text-xl font-mono focus:outline-none focus:ring-1 focus:ring-blue-200"
//                 maxLength={6}
//               />

//               <button
//                 onClick={verifyCodeAndLogin}
//                 disabled={loading || verificationCode.length !== 6}
//                 className="w-full bg-black text-white rounded-xl py-4 font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Verifying..." : "Verify & Login"}
//               </button>

//               <div className="text-center">
//                 <button
//                   onClick={resendCode}
//                   disabled={!canResend || loading}
//                   className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
//                 >
//                   {canResend ? "Resend Code" : `Resend in ${countdown}s`}
//                 </button>
//               </div>

//               <button
//                 onClick={resetFlow}
//                 className="w-full text-gray-600 hover:text-gray-800 py-2"
//               >
//                 ← Change phone number
//               </button>
//             </div>
//           </>
//         )}

//         {msg && <div className="text-green-600 text-center mt-4 text-sm">{msg}</div>}
//         {error && <div className="text-red-600 text-center mt-4 text-sm">{error}</div>}

//         {/* Switch between login/register */}
//         {step === "phone" && (
//           <div className="flex justify-between mt-6 text-xs text-gray-500">
//             <button
//               className="hover:underline"
//               onClick={() => {
//                 setMode(mode === "login" ? "register" : "login");
//                 setError("");
//                 setMsg("");
//               }}
//               type="button"
//             >
//               {mode === "login" ? "Create Account" : "Sign in"}
//             </button>
//             <div>
//               <a href="/privacy-policy" className="hover:underline mr-2">Privacy</a>
//               <a href="/terms" className="hover:underline">Terms</a>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;








// AuthPage.jsx — full file with changes
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "https://api.elfamor.com";
// const API_BASE = "http://localhost:8000";

// Get CSRF token
const getCSRFToken = async () => {
  const res = await fetch(`${API_BASE}/accounts/csrf/`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrfToken || data.csrf_token || "";
};

const AuthPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useRef(true);

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("phone"); // 'phone', 'code'
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(""); // NEW: informational banner
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // If the auth page was reached with an alertMessage, show it
  useEffect(() => {
    const state = location.state || {};
    const alertMessage = state.alertMessage;
    // Fallback: if no alertMessage but 'from' points to productdetails, show the default
    const from = state.from;
    if (alertMessage) {
      setNotice(alertMessage);
    } else if (from && typeof from.pathname === "string" && from.pathname.startsWith("/productdetails")) {
      setNotice("you need to login first to add the product to the cart!");
    } else {
      setNotice("");
    }
  }, [location.state]);

  // Countdown timer for resend code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reload only on very first visit to the app
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedAuth');
    
    if (!hasVisited) {
      console.log("🔄 First visit to auth page - reloading...");
      sessionStorage.setItem('hasVisitedAuth', 'true');
      window.location.reload();
    } else {
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // If already logged-in, redirect back to where we came from (if present) or home
  useEffect(() => {
    if (user) {
      const state = location.state || {};
      const from = state.from;
      if (from && from.pathname) {
        // redirect back to original page (e.g. /productdetails/:id)
        navigate(from.pathname, { replace: true, state: from.state || {} });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate, location.state]);

  const validatePhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const formatPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as +91 XXXXXXXXXX or XXXXXXXXXX
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    return cleaned.slice(0, 10); // Ensure max 10 digits
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    // Allow backspace to work properly
    if (input.length < phone.length) {
      setPhone(input);
      return;
    }
    
    const formatted = formatPhone(input);
    setPhone(formatted);
  };

  const requestVerificationCode = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {
      const csrfToken = await getCSRFToken();
      console.log("CSRF Token:", csrfToken);
      const endpoint = "/accounts/send-verification-code/";
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ phone: phone.replace(/\s/g, '') }),
      });

      const data = await res.json();
      
      if (!isMounted.current) return false;

      if (res.ok) {
        setMsg("Verification code sent to your phone");
        setStep("code");
        setCountdown(60); // 60 seconds countdown
        setCanResend(false);
        return true;
      } else {
        setError(data.error || "Failed to send verification code");
        return false;
      }
    } catch (err) {
      setError("Network error. Please try again.");
      return false;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const verifyCodeAndLogin = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {
      const csrfToken = await getCSRFToken();
      const endpoint = "/accounts/phone-login/";
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ 
          phone: phone.replace(/\s/g, ''), 
          verification_code: verificationCode 
        }),
      });

      const data = await res.json();
      
      if (!isMounted.current) return;

      if (res.ok) {
        setMsg("Login successful!");
        if (data.user) {
          // login in context
          login(data.user);

          // After login, redirect back to `from` if provided in location.state
          const state = location.state || {};
          const from = state.from;
          if (from && from.pathname) {
            navigate(from.pathname, { replace: true, state: from.state || {} });
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const csrfToken = await getCSRFToken();
      const endpoint = "/accounts/register/";
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ 
          email, 
          phone: phone.replace(/\s/g, '') 
        }),
      });

      const data = await res.json();
      
      if (!isMounted.current) return;

      if (res.ok) {
        setMsg("Registration successful! Verification code sent to your phone.");
        setStep("code");
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(60);
    await requestVerificationCode();
  };

  const resetFlow = () => {
    setStep("phone");
    setVerificationCode("");
    setError("");
    setMsg("");
  };

  // Show loading during initial reload
  if (isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efefef] font-sans">
        <div className="text-center">
          <div className="font-logo text-5xl mb-4">Elfamor</div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efefef] font-sans">
      <div className="bg-[#efefef] rounded-2xl p-8 mt-24 mb-10 w-full max-w-md border border-[#f3f3f3] shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <span className="font-logo text-5xl mb-2">Elfamor</span>
        </div>

        {/* Notice banner shown when we were redirected from product details */}
        {notice && (
          <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            {notice}
          </div>
        )}

        {/* Phone Input Step */}
        {step === "phone" && (
          <>
            <h2 className="text-2xl font-normal mb-2 text-center">
              {mode === "login" ? "Sign in with Phone" : "Create Account"}
            </h2>
            <p className="text-gray-700 text-center mb-6 text-base font-normal">
              {mode === "login" 
                ? "Enter your phone number to receive a verification code" 
                : "Enter your phone number to get started"}
            </p>

            <div className="space-y-4">
            <input
                type="tel"
                placeholder="Phone Number* (10 digits)"
                value={phone}
                onChange={handlePhoneChange}
                required
                disabled={loading}
                className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-200 text-base placeholder-gray-500"
                maxLength={12} // 10 digits + 1 space (XXXXX XXXXX)
              />
              {mode === "register" && (
                <input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-200 text-base placeholder-gray-500"
                />
              )}

              <button
                onClick={mode === "login" ? requestVerificationCode : handleRegister}
                disabled={loading || !validatePhone(phone) || (mode === "register" && !email)}
                className="w-full bg-black text-white rounded-xl py-4 font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : mode === "login" ? "Send Code" : "Register & Send Code"}
              </button>
            </div>
          </>
        )}

        {/* Verification Code Step */}
        {step === "code" && (
          <>
            <h2 className="text-2xl font-normal mb-2 text-center">
              Enter Verification Code
            </h2>
            <p className="text-gray-700 text-center mb-6 text-base font-normal">
              We sent a 6-digit code to {phone}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-center text-xl font-mono focus:outline-none focus:ring-1 focus:ring-blue-200"
                maxLength={6}
              />

              <button
                onClick={verifyCodeAndLogin}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-black text-white rounded-xl py-4 font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="text-center">
                <button
                  onClick={resendCode}
                  disabled={!canResend || loading}
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {canResend ? "Resend Code" : `Resend in ${countdown}s`}
                </button>
              </div>

              <button
                onClick={resetFlow}
                className="w-full text-gray-600 hover:text-gray-800 py-2"
              >
                ← Change phone number
              </button>
            </div>
          </>
        )}

        {msg && <div className="text-green-600 text-center mt-4 text-sm">{msg}</div>}
        {error && <div className="text-red-600 text-center mt-4 text-sm">{error}</div>}

        {/* Switch between login/register */}
        {step === "phone" && (
          <div className="flex justify-between mt-6 text-xs text-gray-500">
            <button
              className="hover:underline"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setMsg("");
              }}
              type="button"
            >
              {mode === "login" ? "Create Account" : "Sign in"}
            </button>
            <div>
              <a href="/privacy-policy" className="hover:underline mr-2">Privacy</a>
              <a href="/terms" className="hover:underline">Terms</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
