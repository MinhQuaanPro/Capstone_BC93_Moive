import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./features/movies/HomePage";
import MovieDetail from "./features/movies/MovieDetail";
import BookingPage from "./features/booking/BookingPage";
import Login from "./features/user/Login";
import Register from "./features/user/Register";
import ProfilePage from "./features/user/ProfilePage"; // thêm mới

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/booking/:showtimeId" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* route mới */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
