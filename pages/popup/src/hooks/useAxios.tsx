import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth, { Tokens } from './useAuth';
import { BASE_URL } from './base';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAxios = () => {
  const [tokens, setTokens] = useState<Tokens>({ access_token: '', refresh_token: '' });
  const { setTokensData } = useAuth();

  // Function to retrieve tokens from storage
  const getTokens = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['tokens'], result => {
        const storedTokens = result.tokens || { access_token: '', refresh_token: '' };
        resolve(storedTokens);
      });
    });
  };

  // Add request interceptor to include access token
  axiosInstance.interceptors.request.use(
    async config => {
      if (tokens.access_token) {
        config.headers['Authorization'] = `Bearer ${tokens.access_token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Add response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    response => {
      return response; // If successful, return the response
    },
    async error => {
      const originalRequest = error.config;

      // Check if the error is a 401 and the request has not been retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark this request as retried

        try {
          const response = await axios.post(`${BASE_URL}/refresh`, {
            token: tokens.refresh_token,
          });

          // Store new tokens
          const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
          setTokensData(newAccessToken, newRefreshToken); // Update state with new tokens

          // Update the original request with the new token
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest); // Retry the original request
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Handle failed refresh, e.g., redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // If it's not a 401 error or the request has already been retried, reject the error
      return Promise.reject(error);
    },
  );

  const apiRequest = async (method: string, url: string, data = null) => {
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      return response.data; // Return response data
    } catch (error) {
      console.error('API Request Error:', error);
      throw error; // Re-throw the error to handle it where the hook is used
    }
  };

  return { apiRequest, setTokensData };
};
