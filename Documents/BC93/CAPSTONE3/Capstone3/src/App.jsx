import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store";

// Home Template
import Header from "./components/Header";
import Footer from "./components/Footer";
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

// ✅ SỬA: Component bảo vệ route Admin
const AdminProtectedRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  
  // ✅ Check đúng: state.auth.data HOẶC localStorage
  const isAuth = authState.data || localStorage.getItem("user");
  
  // ✅ Thêm replace: true để tránh loop
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
            <Route path="users" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
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