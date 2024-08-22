import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

// Create the thunk and accept the navigate function as an argument
export const AdvancedSearch = createAsyncThunk(
    'Advanced/AdvancedSearch',
    async ({ Advanced, navigate }, thunkAPI) => {
        console.log(Advanced)
        try {
            const response = await axios.post('https://www.sr.apnipaathshaala.in/api/v1/teacher/Get-Advanced-search', Advanced);
            toast.success('Advanced search completed successfully!');
            navigate('/Search-result');  // Navigate on success
            return response.data.data;
        } catch (error) {
            toast.error('Failed to complete advanced search');
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create the advanced slice
const AdvancedSlice = createSlice({
    name: "Advanced",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(AdvancedSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AdvancedSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(AdvancedSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch Advanced Search";
            });
    },
});

export default AdvancedSlice.reducer;
