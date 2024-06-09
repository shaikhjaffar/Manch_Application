// utils/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Replace with your API URL

export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
        identifier,
      password,
    });

    if (response.status === 200) {
      // Handle successful login
      // For example, save the token to local storage or cookies
      const { token } = response.data;
      localStorage.setItem('token', token);

      return { success: true, token };
    } else {
      // Handle other statuses
      return { success: false, message: 'Login failed. Please try again.' };
    }
  } catch (error) {
    // Handle error
    console.error('Login error:', error);
    
return { success: false, message: error.response?.data?.message || 'An error occurred. Please try again.' };
  }
};
