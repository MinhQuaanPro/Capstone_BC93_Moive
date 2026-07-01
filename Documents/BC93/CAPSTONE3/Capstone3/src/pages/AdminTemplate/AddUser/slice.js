import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q"; // Thay token của bạn

export const addUser = createAsyncThunk(
  "addUser/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/ThemNguoiDung",
        userData,
        { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.content || "Thêm thất bại");
    }
  }
);

const addUserSlice = createSlice({
  name: "addUser",
  initialState: { loading: false, success: null, error: null },
  reducers: {
    clearMessage: (state) => { state.success = null; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => { state.loading = true; state.error = null; state.success = null; })
      .addCase(addUser.fulfilled, (state) => { state.loading = false; state.success = "Thêm thành công!"; })
      .addCase(addUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearMessage } = addUserSlice.actions;
export default addUserSlice.reducer;