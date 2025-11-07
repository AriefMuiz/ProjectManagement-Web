// src/components/Login/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../../../context/AuthContext.jsx";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToastType("error");
      setToastMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setToastMessage(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        setToastType("success");
        setToastMessage("Login successful!");
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setToastType("error");
        setToastMessage(result.message || 'Login failed');
      }
    } catch (err) {
      setToastType("error");
      setToastMessage('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Sign in to Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Please enter your credentials to access the dashboard
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                  type="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
              />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
              {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Logging in...
                  </>
              ) : (
                  'Continue'
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <span>Don't have access? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Request Access here
            </Link>
          </div>
        </div>

        {/* Toast message */}
        {toastMessage && (
            <div className="toast toast-top toast-end">
              <div className={`alert ${toastType === "success" ? "alert-success" : "alert-error"}`}>
                <span>{toastMessage}</span>
              </div>
            </div>
        )}
      </div>
  );
};

export default Login;