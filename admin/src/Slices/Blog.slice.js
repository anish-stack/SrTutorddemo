import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

// Retrieve token from localStorage
const Token = localStorage.getItem('Sr-token');

// Create the thunk with navigate as an argument
export const BlogsSearch = createAsyncThunk(
    'Blog/BlogsSearch',
    async (thunkAPI) => {

        try {
            // Make the request with the token in the headers
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/get-Blogs',

                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            toast.error('Failed to fetch Blogs');
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Example of creating the slice (adjust as needed)
const BlogSlice = createSlice({
    name: 'Blog',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(BlogsSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BlogsSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(BlogsSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch Blogs';
            });
    }
});

export default BlogSlice.reducer;
