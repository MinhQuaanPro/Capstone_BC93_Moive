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
        className="absolute text-white text-center mb-5 py-5 flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            banners.length > 0 ? `url(${banners[0].hinhAnh})` : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 m-5 p-5">
          <h1 className="text-5xl font-bold">
            Chào mừng bạn đến với Rạp Phim Online
          </h1>
          <p className="mt-4 text-xl">Đặt vé nhanh chóng – Xem phim cực đã</p>
          <Link to="/login" className="btn btn-light btn-lg mt-5">
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
