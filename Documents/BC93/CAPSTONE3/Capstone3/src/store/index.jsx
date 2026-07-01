import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../HomeTemplate/movies/movieSlice";
import bookingReducer from "../HomeTemplate/booking/bookingSlice";
import userReducer from "../HomeTemplate/user/userSlice";
import authReducer from "../pages/AdminTemplate/Auth/slice";
import addUserReducer from "../pages/AdminTemplate/AddUser/slice";
import userManagementReducer from "../pages/AdminTemplate/UserManagement/slice";
import movieManagementReducer from "../pages/AdminTemplate/MovieManagement/slice"; // ← Thêm


const store = configureStore({
  reducer: {
    // Home reducers
    movies: movieReducer,
    booking: bookingReducer,
    user: userReducer,
    
    // Admin reducers
    auth: authReducer,
    addUser: addUserReducer,
    userManagement: userManagementReducer,
    movieManagement: movieManagementReducer, // ← Thêm (key khác với "movies")
  },
});

export default store;