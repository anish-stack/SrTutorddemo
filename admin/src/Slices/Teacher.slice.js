import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;
const Token = localStorage.getItem('Sr-token');
console.log(Token)
// Async action to handle fetching all teachers using Axios

export const AllTeacher = createAsyncThunk(
    'Teacher/AllTeacher',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('https://api.srtutorsbureau.com/api/v1/teacher/Get-Teacher', {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            return response.data; // Return the data needed
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data.message || error.message);
        }
    }
);

// Async action to handle fetching a single teacher by ID
export const SingleTeacher = createAsyncThunk(
    'Teacher/SingleTeacher',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`https://api.srtutorsbureau.com/api/v1/teacher/Get-Teacher/${id}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            console.log("Manage Teachert,",response.data)

            return response.data; // Return the data needed
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data.message || error.message);
        }
    }
);

// Create the teacher slice
const TeacherSlice = createSlice({
    name: "Teacher",
    initialState: {
        data: [],
        singleTeacher: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(AllTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AllTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(AllTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch teachers";
            })
            .addCase(SingleTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(SingleTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.singleTeacher = action.payload;
            })
            .addCase(SingleTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch teacher";
            });
    },
});

export default TeacherSlice.reducer;
