import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address.');
    } else {
      setMessage('If the email is registered, a reset link has been sent.');
      // Logic to send reset password link (API call) goes here.
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 bg-white border rounded-md shadow-md w-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>

          {message && (
            <div className="mb-4">
              <p className="text-gray-800">{message}</p>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
