import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

// Async action to handle login using Axios
export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/admin/Admin-login', credentials);
            console.log(response.data)
            if (response.data.user.Role === 'admin') {
                localStorage.setItem('Sr-token', response.data.token);
                localStorage.setItem('Sr-token-user', JSON.stringify(response.data.user));

            } else {
                window.location.href = "/forbidden?SpyLogin=true"
            }


            return response.data; // Return the data needed
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data.message || error.message);
        }
    }
);

// Create the login slice
const loginSlice = createSlice({
    name: "login",
    initialState: {
        isLogin: !!localStorage.getItem('Sr-token'), // Set initial login state based on presence of token
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.isLogin = false;
            localStorage.removeItem('Sr-token'); // Clear the token on logout
            localStorage.removeItem('Sr-token-user'); // Clear the token on logout
            
            toast.success('Logged out successfully!'); // Notify user on successful logout
        },
        checkLogin: (state) => {
            const token = localStorage.getItem('Sr-token');
            if (token) {
                state.isLogin = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogin = true;
                toast.success('Login successful!'); // Notify user on successful login
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
                toast.error('Please Give Us Correct Email For Login.'); // Notify user on login failure
            });
    },
});

export const { logout, checkLogin } = loginSlice.actions;

export default loginSlice;
