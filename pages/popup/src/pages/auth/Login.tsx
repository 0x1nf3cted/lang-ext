import useAuth from '@src/hooks/useAuth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setLoginError('Both fields are required.');
    } else if (!formData.email.includes('@')) {
      setLoginError('Please enter a valid email.');
    } else {
      await login(formData.email, formData.password);
      setLoginError('');
      alert('Login Successful!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 bg-white border rounded-md shadow-md w-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Login
          </button>
          <Link to="/register">
            <p className="text-green-500">Forgot password</p>
          </Link>

          <p className=" text-center mt-4">
            Don't have an account?{' '}
            <Link to="/register">
              <p className="text-green-500">sign up</p>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
