import React from "react";
import MovieList from "./MovieList";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <header className="bg-primary text-white text-center py-5 mb-4">
        <h1 className="display-4">Chào mừng bạn đến với Rạp Phim Online</h1>
        <p className="lead">Đặt vé nhanh chóng – Xem phim cực đã</p>
        <Link to="/login" className="btn btn-light btn-lg mt-3">
          Bắt đầu đặt vé
        </Link>
      </header>

      <section className="container">
        <MovieList />
      </section>
    </div>
  );
};

export default HomePage;
