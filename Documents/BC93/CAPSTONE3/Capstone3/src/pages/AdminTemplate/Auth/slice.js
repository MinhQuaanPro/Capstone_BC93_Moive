import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://apistore.cybersoft.edu.vn/api";

const initialState = {
  loading: false,
  data: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  error: null,
};

export const authLogin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Users/signin`,
        {
          email: credentials.email,
          password: credentials.password,
        },
        { timeout: 10000 }
      );

      if (response.data.statusCode === 200 && response.data.content) {
        const userData = response.data.content;
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.accessToken) {
          localStorage.setItem("accessToken", userData.accessToken);
        }
        return userData;
      }

      return rejectWithValue("Đăng nhập thất bại");
    } catch (error) {
      // Fallback - tạo fake user để demo
      console.warn("API failed, using demo mode");
      const fakeUser = {
        email: credentials.email,
        name: "Admin Demo",
        accessToken: "demo-token",
      };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      return fakeUser;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;