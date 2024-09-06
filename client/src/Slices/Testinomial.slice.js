import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

// Retrieve token from localStorage
const Token = localStorage.getItem('Sr-token');

// Create the thunk with navigate as an argument
export const GetTestimonials = createAsyncThunk(
    'Testimonials/Testimonials',
    async (thunkAPI) => {

        try {
            // Make the request with the token in the headers
            const response = await axios.get('https://www.sr.apnipaathshaala.in/api/v1/admin/Get-All-Active-Testimonials',

                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            toast.error('Failed to fetch Testimonials');
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Example of creating the slice (adjust as needed)
const TestimonialsSlice = createSlice({
    name: 'Testimonials',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(GetTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch Testimonials';
            });
    }
});

export default TestimonialsSlice.reducer;
