import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../../fetch/common";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      navigate("/admin/dashboard");
      // const { token } = await authApi.login(email, password);
      // const decoded = jwtDecode(token);
      // // Save token if needed: localStorage.setItem("token", token);
      // if (decoded.roles && decoded.roles.includes("admin")) {
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/user/dashboard");
      // }
    } catch (err) {
      setError(err.message);
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
          {error && (
              <div className="text-red-600 text-center mb-2">{error}</div>
          )}
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
              />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <span>Don’t have access? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Request Access here
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Login;