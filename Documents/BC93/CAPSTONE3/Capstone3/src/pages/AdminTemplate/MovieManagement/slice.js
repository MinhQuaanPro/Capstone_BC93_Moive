import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://movienew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q";

// Helper lấy headers với Authorization
const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user.accessToken;
  
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
  movies: [],
  movieDetail: null,
  error: null,
};

// 1. Lấy danh sách phim - ✅ THỬ GET METHOD
export const fetchMovies = createAsyncThunk(
  "movieManagement/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/QuanLyPhim/LayDanhSachPhim`,
        { 
          headers: getHeaders(),
          params: { maNhom: "GP01" }  // ✅ Query params
        }
      );
      console.log("✅ Fetch movies success:", response.data);
      return response.data.content;
    } catch (error) {
      console.error("❌ Fetch movies error:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
      return rejectWithValue(error.response?.data);
    }
  }
);

// 2. Xóa phim - ✅ ĐÚNG THEO SWAGGER
export const deleteMovie = createAsyncThunk(
  "movieManagement/deleteMovie",
  async (maPhim, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting movie ID:", maPhim);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const accessToken = user.accessToken;
      
      if (!accessToken) {
        throw new Error("Chưa đăng nhập! Vui lòng login lại.");
      }
      
      // ✅ DELETE với query parameter MaPhim (không phải path param)
      const response = await axios.delete(
        `${API_BASE_URL}/QuanLyPhim/XoaPhim`,  // ← KHÔNG có /${maPhim}
        {
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            MaPhim: parseInt(maPhim)  // ← Query parameter
          }
        }
      );
      
      console.log("✅ Delete success:", response.data);
      return maPhim;
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data);
      console.error(" Status:", error.response?.status);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// 3. Thêm phim mới (có upload hình)
export const addMovie = createAsyncThunk(
  "movieManagement/addMovie",
  async (movieData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("tenPhim", movieData.tenPhim);
      formData.append("trailer", movieData.trailer || "");
      formData.append("moTa", movieData.moTa || "");
      formData.append("maNhom", movieData.maNhom || "GP01");
      formData.append("ngayKhoiChieu", movieData.ngayKhoiChieu);
      formData.append("sapChieu", movieData.sapChieu);
      formData.append("dangChieu", movieData.dangChieu);
      formData.append("hot", movieData.hot);
      formData.append("danhGia", movieData.danhGia || 0);
      
      if (movieData.hinhAnh) {
        formData.append("File", movieData.hinhAnh);
      }

      const response = await axios.post(
        `${API_BASE_URL}/QuanLyPhim/ThemPhimUploadHinh`,
        formData,
        { headers: getHeaders() }
      );
      return response.data.content;
    } catch (error) {
      console.error("❌ Add movie error:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);

// 4. Cập nhật phim (có upload hình)
export const updateMovie = createAsyncThunk(
  "movieManagement/updateMovie",
  async (movieData, { rejectWithValue }) => {
    try {
      console.log("📤 Update movie - Input:", movieData);
      
      if (!movieData.maPhim) {
        throw new Error("Thiếu mã phim!");
      }
      
      const formData = new FormData();
      formData.append("maPhim", movieData.maPhim);
      formData.append("tenPhim", movieData.tenPhim);
      formData.append("trailer", movieData.trailer || "");
      formData.append("moTa", movieData.moTa || "");
      formData.append("maNhom", movieData.maNhom || "GP01");
      formData.append("ngayKhoiChieu", movieData.ngayKhoiChieu);
      formData.append("sapChieu", movieData.sapChieu);
      formData.append("dangChieu", movieData.dangChieu);
      formData.append("hot", movieData.hot);
      formData.append("danhGia", movieData.danhGia || 0);
      
      if (movieData.hinhAnh) {
        formData.append("File", movieData.hinhAnh);
      }

      const headers = getHeaders();
      
      console.log("🔑 Token:", headers.Authorization ? "✅ Có" : "❌ Không");

      const response = await axios.post(
        `${API_BASE_URL}/QuanLyPhim/CapNhatPhimUpload`,
        formData,
        { headers }
      );
      
      console.log("✅ Response:", response.data);
      return response.data.content;
    } catch (error) {
      console.error("❌ Update error:", error.response?.data);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// 5. Lấy thông tin phim theo ID
export const getMovieById = createAsyncThunk(
  "movieManagement/getMovieById",
  async (maPhim, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const accessToken = user.accessToken;
      
      // ✅ Thử query parameter
      const response = await axios.get(
        `${API_BASE_URL}/QuanLyPhim/LayThongTinPhim`,
        {
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
          params: {
            MaPhim: parseInt(maPhim)
          }
        }
      );
      
      console.log("✅ Response:", response.data);
      return response.data.content;
    } catch (error) {
      console.error("❌ Error:", error.response?.data);
      return rejectWithValue(error.response?.data);
    }
  }
);
const movieManagementSlice = createSlice({
  name: "movieManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMovieDetail: (state) => {
      state.movieDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(
          (movie) => movie.maPhim !== action.payload
        );
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.push(action.payload);
        state.error = null;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movies.findIndex(
          (movie) => movie.maPhim === action.payload.maPhim
        );
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMovieById.fulfilled, (state, action) => {
        state.movieDetail = action.payload;
      });
  },
});

export const { clearError, clearMovieDetail } = movieManagementSlice.actions;
export default movieManagementSlice.reducer;