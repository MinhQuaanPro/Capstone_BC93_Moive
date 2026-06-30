import React, { useEffect, useState } from "react";
import MovieList from "./MovieList";
import { Link } from "react-router-dom";
import { getBanners } from "../../services/movieService";

const HomePage = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const res = await getBanners();
        setBanners(res.data.content);
      } catch (err) {
        console.error("Lỗi khi tải banner:", err);
      }
    };
    fetchBannerData();
  }, []);

  return (
    <div>
      <header
        className="relative w-full h-[800px] flex items-center justify-center text-white mb-10"
        style={{
          backgroundImage:
            banners.length > 0 ? `url(${banners[0].hinhAnh})` : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">
            Chào mừng bạn đến với Rạp Phim Online
          </h1>
          <p className="mt-4 text-xl md:text-2xl italic">
            Đặt vé nhanh chóng – Xem phim cực đã
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Bắt đầu đặt vé
          </Link>
        </div>
      </header>

      <section className="container">
        <MovieList />
      </section>
    </div>
  );
};

export default HomePage;
