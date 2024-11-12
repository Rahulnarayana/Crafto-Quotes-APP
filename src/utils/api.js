// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://assignment.stage.crafto.app';

export const login = async (username, otp) => {
  return await axios.post(`${API_URL}/login`, { username, otp });
};

export const uploadImage = async (formData) => {
  return await axios.post(`https://crafto.app/crafto/v1.0/media/assignment/upload`, formData);
};

export const createQuote = async (token, text, mediaUrl) => {
    try {
      const response = await axios.post(
        `${API_URL}/postQuote`,
        { text, mediaUrl },
        { headers: { Authorization: token } }
      );
      return response.data; // Return the response data for further processing if needed
    } catch (error) {
      console.error('Error creating quote:', error.message);
      throw new Error('Failed to create quote. Please try again later.'); // Throwing a new error for better handling
    }
  };

export const getQuotes = async (token, limit, offset) => {
    try {
      const response = await axios.get(`${API_URL}/getQuotes?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: token, // Make sure to include the token here
        },
      });
      return response.data; // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error; // Re-throw error to handle it in the calling function
    }
  };