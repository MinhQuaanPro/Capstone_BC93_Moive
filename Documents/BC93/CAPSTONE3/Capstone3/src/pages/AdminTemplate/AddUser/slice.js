import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://movienew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q";

// ✅ Helper lấy headers với Authorization
const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user.accessToken;
  
  console.log("🔑 Access Token:", accessToken ? "✅ Có" : "❌ Không");
  
  const headers = {
    TokenCybersoft: TOKEN_CYBERSOFT,
  };
  
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return headers;
};

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export const addUser = createAsyncThunk(
  "addUser/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("📤 Adding user:", userData);
      console.log("🔑 Headers:", getHeaders());
      
      const response = await axios.post(
        `${API_BASE_URL}/QuanLyNguoiDung/ThemNguoiDung`,
        userData,
        { headers: getHeaders() }
      );
      
      console.log("✅ Add user success:", response.data);
      return response.data.content;
    } catch (error) {
      console.error("❌ Add user error:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const addUserSlice = createSlice({
  name: "addUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addUserSlice.reducer;