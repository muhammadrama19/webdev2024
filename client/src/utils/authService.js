import axios from 'axios';
import Cookies from 'js-cookie';

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('http://localhost:8001/refresh-token', { token: refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};
