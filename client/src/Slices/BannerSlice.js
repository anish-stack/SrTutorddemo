import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

// Create the thunk with navigate as an argument
export const FetchBanner = createAsyncThunk(
    'Banners/fetchBanner',
    async (_, thunkAPI) => {
        try {
            // Make the request with the token in the headers
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/get-Banner', {
             
            });
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error('Failed to fetch Banners');
            console.error('FetchBanner Error:', errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }   
);

// Create the slice
const BannersSlice = createSlice({
    name: 'Banners',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FetchBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(FetchBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch Banners';
            });
    }
});

export default BannersSlice.reducer;
