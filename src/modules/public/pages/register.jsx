// src/modules/public/pages/register.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => (
  <div className="min-h-screen bg-base-200 flex items-center justify-center">
    <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8">
      <h2 className="text-2xl font-bold text-primary mb-2 text-center">Register for GoSurvey</h2>
      <p className="mb-6 text-base-content/70 text-center">Create your account to start building surveys.</p>
      <form>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input type="text" placeholder="Your Name" className="input input-bordered" required />
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="you@example.com" className="input input-bordered" required />
        </div>
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="••••••••" className="input input-bordered" required />
        </div>
        <button type="submit" className="btn btn-primary w-full mb-2">Register</button>
      </form>
      <div className="text-center mt-4">
        <span className="text-sm text-base-content/60">Already have an account? </span>
        <Link to="/login" className="link link-primary">Login</Link>
      </div>
    </div>
  </div>
);

export default Register;