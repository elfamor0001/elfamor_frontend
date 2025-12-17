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
  const { user } = useAuth();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // wait until auth state is known
  if (user === undefined) return null;

  if (!user) {
    // 🔔 show toast ONLY ONCE
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

  return children;
};

export default ProtectedRoute;
