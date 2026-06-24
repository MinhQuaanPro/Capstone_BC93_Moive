import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMovies, getMovieDetail } from "../../services/movieService";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const res = await getMovies();
  return res.data.content;
});

export const fetchMovieDetail = createAsyncThunk("movies/fetchMovieDetail", async (id) => {
  const res = await getMovieDetail(id);
  return res.data.content;
});

const movieSlice = createSlice({
  name: "movies",
  initialState: { list: [], detail: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchMovieDetail.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default movieSlice.reducer;
