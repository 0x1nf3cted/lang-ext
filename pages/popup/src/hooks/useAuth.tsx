import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './base';

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

const useAuth = () => {
  const [tokens, setTokens] = useState<Tokens>({ access_token: '', refresh_token: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to retrieve tokens from storage
  const getTokens = () => {
    chrome.storage.sync.get(['tokens'], result => {
      const old_tokens: Tokens = result.tokens || { access_token: '', refresh_token: '' };
      setTokens(old_tokens);
    });
  };

  // Function to set tokens in storage
  const setTokensData = (accessToken: string, refreshToken: string) => {
    const newTokens: Tokens = { access_token: accessToken, refresh_token: refreshToken };

    chrome.storage.sync.set({ tokens: newTokens }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving tokens:', chrome.runtime.lastError);
        return;
      }
      setTokens(newTokens);
      setIsAuthenticated(true);
    });
  };

  // Function to register
  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/email/register`, { email, password });
      setError(null); // Clear any previous error
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  // Function to login
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/email/login`, { email, password });

      const { token, refreshToken } = response.data; // Ensure this matches your API response
      setTokensData(token, refreshToken);
      setError(null); // Clear any previous error
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  // Add a request interceptor to attach the access token to every request
  axiosInstance.interceptors.request.use(
    config => {
      getTokens(); // Retrieve tokens before sending request
      if (tokens.access_token) {
        config.headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    response => {
      return response; // Return the response if successful
    },
    async error => {
      const originalRequest = error.config;

      // If we get a 401 error and the original request wasn't already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried

        try {
          getTokens(); // Refresh tokens from storage
          const response = await axios.post(`${BASE_URL}/refresh`, {
            refresh_token: tokens.refresh_token,
          });

          // Store new tokens
          const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data; // Ensure the keys match your API response
          setTokensData(newAccessToken, newRefreshToken); // Update state with new tokens

          // Retry the original request with the new token
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          window.location.href = '/login'; // Redirect to login on refresh failure
          return Promise.reject(refreshError);
        }
      }

      // If the error wasn't due to an expired token or other unhandled error
      return Promise.reject(error);
    },
  );

  // Function to logout
  const logout = () => {
    chrome.storage.sync.remove('tokens', () => {
      setTokens({ access_token: '', refresh_token: '' });
      setIsAuthenticated(false);
    });
  };

  // Check for existing token in storage on mount
  useEffect(() => {
    getTokens();
    // If tokens exist, set authenticated state
    if (tokens.access_token) {
      setIsAuthenticated(true);
    }
  }, [tokens]);

  return {
    access_token: tokens.access_token,
    isAuthenticated,
    setTokensData,
    login,
    logout,
    register,
    error,
  };
};

export default useAuth;
