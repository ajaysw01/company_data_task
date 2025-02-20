import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, {
    name: userData.name,
    email: userData.email,
    password: userData.password
  });
  return response.data;
};


const login = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;