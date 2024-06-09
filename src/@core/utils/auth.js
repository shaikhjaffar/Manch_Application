// utils/auth.js
import axios from 'axios';
import { base_url } from './Constant';



export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${base_url}/login`, {
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
