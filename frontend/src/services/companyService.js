// services/companyService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getCompanyData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/csv/process_csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const companyService = {
  getCompanyData,
};

export default companyService;