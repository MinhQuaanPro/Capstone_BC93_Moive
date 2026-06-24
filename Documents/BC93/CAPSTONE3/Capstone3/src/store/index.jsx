import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movies/movieSlice";
import bookingReducer from "../features/booking/bookingSlice";
import userReducer from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    movies: movieReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});
export default store;
