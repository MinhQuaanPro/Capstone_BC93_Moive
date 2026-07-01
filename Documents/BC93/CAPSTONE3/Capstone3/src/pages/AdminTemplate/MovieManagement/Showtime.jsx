import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://movienew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q";

export default function Showtime() {
  const { maPhim } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showtimeData, setShowtimeData] = useState({
    maPhim: "",
    ngayChieuGioChieu: "",
    maRap: "",
    giaVe: 75000,
  });

  useEffect(() => {
    fetchMovieDetail();
    fetchTheaters();
  }, [maPhim]);

  const fetchMovieDetail = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/QuanLyPhim/LayThongTinPhim/${maPhim}`,
        { headers: { TokenCybersoft: TOKEN_CYBERSOFT } }
      );
      setMovie(response.data.content);
      setShowtimeData((prev) => ({ ...prev, maPhim: maPhim }));
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

 const fetchTheaters = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.accessToken;
    
    const response = await axios.get(
      `${API_BASE_URL}/QuanLyRap/LayThongTinHeThongRap`,
      {
        headers: {
          TokenCybersoft: TOKEN_CYBERSOFT,
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    console.log("🎪 Theaters response:", response.data);
    setTheaters(response.data.content || []);
  } catch (error) {
    console.error("❌ Error fetching theaters:", error);
    alert("Không thể tải danh sách rạp!");
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtimeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.accessToken;

      await axios.post(
        `${API_BASE_URL}/QuanLyDatVe/DatVe`,
        {
          maPhim: showtimeData.maPhim,
          ngayChieuGioChieu: showtimeData.ngayChieuGioChieu,
          maRap: showtimeData.maRap,
          giaVe: showtimeData.giaVe,
        },
        {
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Tạo lịch chiếu thành công!");
      navigate("/admin/movies");
    } catch (error) {
      console.error("Error creating showtime:", error);
      alert("❌ Tạo lịch chiếu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!movie) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="fas fa-calendar-plus me-2 text-primary"></i>
          Tạo Lịch Chiếu
        </h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/movies")}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Quay lại
        </button>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="mb-3">Thông tin phim</h5>
              <div className="text-center mb-3">
                <img
                  src={movie.hinhAnh}
                  alt={movie.tenPhim}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
              <h4 className="fw-bold text-center">{movie.tenPhim}</h4>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">Thông tin lịch chiếu</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Ngày chiếu & Giờ chiếu *
                  </label>
                  <input
                    type="datetime-local"
                    name="ngayChieuGioChieu"
                    className="form-control"
                    value={showtimeData.ngayChieuGioChieu}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Chọn rạp *</label>
                  <select
                    name="maRap"
                    className="form-select"
                    value={showtimeData.maRap}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn rạp --</option>
                    {theaters.map((theater) => (
                      <optgroup key={theater.maHeThongRap} label={theater.tenHeThongRap}>
                        {theater.cumRapChieu?.map((cumRap) => (
                          cumRap.danhSachRap?.map((rap) => (
                            <option key={rap.maRap} value={rap.maRap}>
                              {cumRap.tenCumRap} - {rap.tenRap}
                            </option>
                          ))
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Giá vé (VNĐ) *</label>
                  <input
                    type="number"
                    name="giaVe"
                    className="form-control"
                    value={showtimeData.giaVe}
                    onChange={handleChange}
                    min="0"
                    step="5000"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus-circle me-2"></i>
                      Tạo lịch chiếu
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}