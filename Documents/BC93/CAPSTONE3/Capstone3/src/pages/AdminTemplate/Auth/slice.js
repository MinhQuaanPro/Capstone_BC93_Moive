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
        }
      );

      if (response.data.statusCode === 200 && response.data.content) {
        const userData = response.data.content;
        
        // ✅ TẠM BỎ CHECK QUYỀN - Để test UI
        // if (userData.userTypeId !== 1) {
        //   return rejectWithValue({
        //     response: {
        //       data: {
        //         content: "Bạn không có quyền truy cập admin!",
        //       },
        //     },
        //   });
        // }

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", userData.accessToken);
        
        return userData;
      }

      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error);
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;