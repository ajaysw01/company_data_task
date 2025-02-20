// features/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companyService from '../services/companyService';

export const fetchCompanyData = createAsyncThunk(
  'company/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanyData();
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue({ message: 'Session expired', status: 401 });
      }
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    countryStats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false;
        // Extract the correct data from the nested structure
        state.companies = action.payload.data.company_data || [];
        state.countryStats = action.payload.data.country_stats || [];
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch data';
      });
  },
});

export default companySlice.reducer;