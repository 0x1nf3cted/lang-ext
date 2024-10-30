import useAuth from '@src/hooks/useAuth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const { register, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errorList: string[] = [];
    if (!formData.email.includes('@')) errorList.push('Valid email is required.');
    if (formData.password.length < 6) errorList.push('Password must be at least 6 characters.');
    return errorList;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      await register(formData.email, formData.password);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 bg-white border rounded-md shadow-md w-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sign Up</h2>

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

          {errors.length > 0 && (
            <div className="mb-4">
              <ul className="list-disc list-inside text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Sign Up
          </button>
          <p className=" text-center mt-4">
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-green-500">log in</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
