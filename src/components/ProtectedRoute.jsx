// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   const location = useLocation();

//   // if not authenticated, redirect to /auth and preserve return location
//   if (!user) {
//     return <Navigate to="/auth" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // ⛔ WAIT until auth check finishes
  if (authLoading) {
    return null; // or loader if you want
  }

  // ❌ user is definitely NOT logged in
  if (!user) {
    if (!toastShownRef.current) {
      toast.error('Please login first to see your orders');
      toastShownRef.current = true;
    }

    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ logged in
  return children;
};

export default ProtectedRoute;
