import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../HomeTemplate/movies/movieSlice";
import bookingReducer from "../HomeTemplate/booking/bookingSlice";
import userReducer from "../HomeTemplate/user/userSlice";
import authReducer from "../pages/AdminTemplate/Auth/slice";
import addUserReducer from "../pages/AdminTemplate/AddUser/slice";
import userManagementReducer from "../pages/AdminTemplate/UserManagement/slice";

const store = configureStore({
  reducer: {
    movies: movieReducer,
    booking: bookingReducer,
    user: userReducer,
    auth: authReducer, // ✅ Key là "auth"
    addUser: addUserReducer,
    userManagement: userManagementReducer,
  },
});

export default store;