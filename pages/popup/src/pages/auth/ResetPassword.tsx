import React, { useState } from 'react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
    } else if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
    } else {
      setMessage('Password has been successfully reset!');
      // Logic to reset the password (e.g., API call) goes here.
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 bg-white border rounded-md shadow-md w-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-4">Please enter a new password for your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Confirm your password"
            />
          </div>

          {message && (
            <div className="mb-4">
              <p className={message.includes('successfully') ? 'text-green-600' : 'text-red-600'}>{message}</p>
            </div>
          )}

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
