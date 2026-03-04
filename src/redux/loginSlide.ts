import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginDto, CreateUserDto, User } from '../types/userType';
import {
    login as apiLogin,
    logout as apiLogout,
    register as apiRegister,
    loadTokenFromStorage,
    getIsAdmin,
    getCurrentUser
} from './axios';

interface LoginState {
    isLoggedIn: boolean;
    isAdmin: boolean;
    user: User | null;
    loading: boolean;
    token: string | null;
}

const initialState: LoginState = {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    loading: false,
    token: null,
};

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (credentials: LoginDto) => {
        const response = await apiLogin(credentials);
        return response;
    }
);

export const registerUser = createAsyncThunk(
    'login/registerUser',
    async (userData: CreateUserDto) => {
        const response = await apiRegister(userData);
        return response;
    }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    'login/logoutUser',
    async () => {
        apiLogout();
        return null;
    }
);

// Async thunk for checking existing authentication
export const checkAuthStatus = createAsyncThunk(
    'login/checkAuthStatus',
    async () => {
        const token = loadTokenFromStorage();
        const isAdmin = getIsAdmin();
        const user = getCurrentUser();
        return { token, isAdmin, user };
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setAdminStatus: (state, action) => {
            state.isAdmin = action.payload;
        },
        resetAuth: (state) => {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.isAdmin = action.payload.admin;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.isAdmin = false;
                state.user = null;
                state.token = null;
            })
            // Handle registration
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                // Note: Registration doesn't automatically log user in
            })
            .addCase(registerUser.rejected, (state) => {
                state.loading = false;
            })
            // Handle logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.isAdmin = false;
                state.user = null;
                state.token = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
            })
            // Handle checking auth status
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.token) {
                    state.isLoggedIn = true;
                    state.token = action.payload.token;
                    state.isAdmin = action.payload.isAdmin;
                    state.user = action.payload.user;
                } else {
                    state.isLoggedIn = false;
                    state.isAdmin = false;
                    state.user = null;
                    state.token = null;
                }
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.isAdmin = false;
                state.user = null;
                state.token = null;
            });
    },
});

export const { setAdminStatus, resetAuth } = loginSlice.actions;
export default loginSlice.reducer;