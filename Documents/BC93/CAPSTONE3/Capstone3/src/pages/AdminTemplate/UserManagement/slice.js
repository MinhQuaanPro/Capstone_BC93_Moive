import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Token từ Auth slice - copy lại
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q";

const API_BASE_URL = "https://movienew.cybersoft.edu.vn/api";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

// Lấy danh sách người dùng
export const fetchUsersService = createAsyncThunk(
  "fetchUsersService",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/QuanLyNguoiDung/LayDanhSachNguoiDung`,
        {
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Xóa người dùng
export const deleteUserService = createAsyncThunk(
  "deleteUserService",
  async (taiKhoan, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/QuanLyNguoiDung/XoaNguoiDung/${taiKhoan}`,
        {
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
          },
        }
      );
      return taiKhoan;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userManagementSlice = createSlice({
  initialState,
  name: "userManagementSlice",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsersService.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsersService.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUsersService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteUserService.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (user) => user.taiKhoan !== action.payload
      );
    });
    builder.addCase(deleteUserService.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default userManagementSlice.reducer;