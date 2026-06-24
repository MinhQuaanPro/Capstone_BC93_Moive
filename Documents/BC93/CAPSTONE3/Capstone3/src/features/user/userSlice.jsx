import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { register, login, getProfile } from "../../services/userService";

export const userRegister = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await register(formData);
      alert("Đăng ký thành công!");
      return res.data.content;
    } catch (err) {
      alert(err.response?.data?.content || "Đăng ký thất bại, vui lòng thử lại!");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await login(formData);
      const token = res.data.content.accessToken;
      // Lưu token và user vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(res.data.content));
      alert("Đăng nhập thành công!");
      return res.data.content;
    } catch (err) {
      alert(err.response?.data?.content || "Đăng nhập thất bại!");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const userProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile();
      // Cập nhật lại user trong localStorage
      localStorage.setItem("user", JSON.stringify(res.data.content));
      return res.data.content;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const savedUser = localStorage.getItem("user");

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(userProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
