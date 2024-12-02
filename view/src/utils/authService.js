import axios from 'axios';
import Cookies from 'js-cookie';

const  apiUrl = process.env.REACT_APP_API_URL;

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${apiUrl}/refresh-token`, { token: refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};
