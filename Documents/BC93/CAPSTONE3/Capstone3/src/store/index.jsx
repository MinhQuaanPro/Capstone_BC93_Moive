import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../HomeTemplate/movies/movieSlice";
import bookingReducer from "../HomeTemplate/booking/bookingSlice";
import userReducer from "../HomeTemplate/user/userSlice";

const store = configureStore({
  reducer: {
    movies: movieReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});
export default store;
