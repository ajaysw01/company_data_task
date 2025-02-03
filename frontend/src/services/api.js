export const fetchCompanyData = async () => {
  try {
    const response = await fetch('http://localhost:8000/process_csv_v2'); 
    if (!response.ok) {
      throw new Error('Failed to fetch company data');
    }
    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};
