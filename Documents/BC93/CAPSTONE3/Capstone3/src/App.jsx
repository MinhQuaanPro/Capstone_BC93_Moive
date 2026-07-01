import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

// Home Template
import Header from "./components/header";
import Footer from "./components/footer";
import HomePage from "./HomeTemplate/movies/HomePage";
import MovieDetail from "./HomeTemplate/movies/MovieDetail";
import BookingPage from "./HomeTemplate/booking/BookingPage";
import Login from "./HomeTemplate/user/Login";
import Register from "./HomeTemplate/user/Register";
import ProfilePage from "./HomeTemplate/user/ProfilePage";

// Admin Template
import AdminTemplate from "./pages/AdminTemplate";
import Auth from "./pages/AdminTemplate/Auth";
import Dashboard from "./pages/AdminTemplate/Dashboard";
import AddUser from "./pages/AdminTemplate/AddUser";
import UserManagement from "./pages/AdminTemplate/UserManagement";

// Movie Management - ✅ THÊM CÁC IMPORT NÀY
import MovieManagement from "./pages/AdminTemplate/MovieManagement";
import AddMovie from "./pages/AdminTemplate/MovieManagement/AddMovie";
import EditMovie from "./pages/AdminTemplate/MovieManagement/EditMovie";
import Showtime from "./pages/AdminTemplate/MovieManagement/Showtime"; // ✅ Quan trọng!

// Component bảo vệ route Admin
const AdminProtectedRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  const isAuth = authState.data || localStorage.getItem("user");
  return isAuth ? children : <Navigate to="/admin/login" replace />;
};

// Layout cho Home
const HomeLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* ============ ADMIN ROUTES ============ */}
          <Route path="/admin/login" element={<Auth />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminTemplate />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            {/* User Management */}
            <Route path="users" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
            
            {/* Movie Management - ✅ THÊM CÁC ROUTE NÀY */}
            <Route path="movies" element={<MovieManagement />} />
            <Route path="movies/add" element={<AddMovie />} />
            <Route path="movies/edit/:maPhim" element={<EditMovie />} />
            <Route path="movies/showtime/:maPhim" element={<Showtime />} /> {/* ✅ Quan trọng! */}
          </Route>

          {/* ============ HOME ROUTES ============ */}
          <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />
          <Route path="/movie/:id" element={<HomeLayout><MovieDetail /></HomeLayout>} />
          <Route path="/booking/:showtimeId" element={<HomeLayout><BookingPage /></HomeLayout>} />
          <Route path="/login" element={<HomeLayout><Login /></HomeLayout>} />
          <Route path="/register" element={<HomeLayout><Register /></HomeLayout>} />
          <Route path="/profile" element={<HomeLayout><ProfilePage /></HomeLayout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;