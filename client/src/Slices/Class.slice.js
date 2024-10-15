import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

// Retrieve token from localStorage
const Token = localStorage.getItem('Sr-token');

// Create the thunk with navigate as an argument
export const ClassSearch = createAsyncThunk(
    'Class/ClassSearch',
    async (thunkAPI) => {

        try {
            // Make the request with the token in the headers
            const response = await axios.get('http://localhost:7000/api/v1/admin/Get-Classes',

                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            console.log(response.data.data)
            return response.data.data.sort((a, b) => a.postition - b.postition);
        } catch (error) {
            toast.error('Failed to fetch classes');
            console.log(error);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Example of creating the slice (adjust as needed)
const classSlice = createSlice({
    name: 'class',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(ClassSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ClassSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(ClassSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch classes';
            });
    }
});

export default classSlice.reducer;
