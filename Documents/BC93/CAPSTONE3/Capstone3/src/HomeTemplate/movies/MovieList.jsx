import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "./movieSlice";
import { Link } from "react-router-dom";
import {
  getHeThongRap,
  getLichChieuHeThongRap,
} from "../../services/movieService";

const MovieList = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.movies);
  const [searchTerm, setSearchTerm] = useState("");
  const [heThongRap, setHeThongRap] = useState([]);
  const [lichChieu, setLichChieu] = useState([]);
  const [selectedRap, setSelectedRap] = useState(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    const fetchRapData = async () => {
      try {
        const res = await getHeThongRap();
        setHeThongRap(res.data.content);
      } catch (err) {
        console.error("Lỗi khi tải hệ thống rạp:", err);
      }
    };
    fetchRapData();
  }, []);

  useEffect(() => {
    const fetchLichChieu = async () => {
      if (!selectedRap) return;
      try {
        const res = await getLichChieuHeThongRap(selectedRap);
        setLichChieu(res.data.content);
      } catch (err) {
        console.error("Lỗi khi tải lịch chiếu:", err);
      }
    };
    fetchLichChieu();
  }, [selectedRap]);

  if (status === "loading")
    return <p className="text-center pt-5">Đang tải phim...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500 pt-5">Lỗi khi tải phim!</p>;

  const filteredMovies = list.filter((movie) =>
    movie.tenPhim.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        🎬 Danh sách phim
      </h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-3/4 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-md-4 mb-4" key={movie.maPhim}>
            <div className="card h-100 shadow-sm">
              <img
                className="card-img-top"
                src={movie.hinhAnh}
                alt={movie.tenPhim}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h4 className="card-title text-center">{movie.tenPhim}</h4>
                <Link
                  to={`/movie/${movie.maPhim}`}
                  className="btn btn-primary mt-auto"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="container mt-5 border rounded shadow"
        style={{ height: "600px", overflowY: "auto" }}
      >
        <div className="row mt-5" style={{ height: "600px" }}>
          <div
            className="col-md-4 border-end"
            style={{ height: "100%", overflowY: "auto" }}
          >
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              🏢 Hệ Thống Rạp
            </h2>
            {heThongRap.map((rap) => (
              <div
                key={rap.maHeThongRap}
                className={`card mb-3 shadow-sm ${
                  selectedRap === rap.maHeThongRap
                    ? "border border-success"
                    : ""
                }`}
                onClick={() => setSelectedRap(rap.maHeThongRap)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={rap.logo}
                  alt={rap.tenHeThongRap}
                  className="card-img-top p-3"
                  style={{ height: "100px", objectFit: "contain" }}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{rap.tenHeThongRap}</h5>
                </div>
              </div>
            ))}
          </div>

          <div
            className="col-md-8"
            style={{ height: "100%", overflowY: "auto" }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              🎬 Lịch Chiếu
            </h2>
            {lichChieu.length === 0 ? (
              <p className="text-muted">
                Chọn một hệ thống rạp để xem lịch chiếu.
              </p>
            ) : (
              lichChieu[0].lstCumRap.map((cumRap) => (
                <div key={cumRap.maCumRap} className="mb-4">
                  <h5 className="fw-bold text-danger">{cumRap.tenCumRap}</h5>
                  {cumRap.danhSachPhim.map((phim) => (
                    <div key={phim.maPhim} className="mb-3">
                      <p className="fw-bold">{phim.tenPhim}</p>
                      <div className="d-flex flex-wrap gap-2">
                        {phim.lstLichChieuTheoPhim.map((lich) => (
                          <Link
                            key={lich.maLichChieu}
                            to={`/booking/${lich.maLichChieu}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            {new Date(lich.ngayChieuGioChieu).toLocaleString()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
