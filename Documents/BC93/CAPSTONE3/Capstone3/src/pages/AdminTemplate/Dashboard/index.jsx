import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard.css";

const API_BASE_URL = "https://movienew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MyIsIkhldEhhblN0cmluZyI6IjA0LzEyLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc5NjM0MjQwMDAwMCIsIm5iZiI6MTc2Nzk3ODAwMCwiZXhwIjoxNzk2NDkwMDAwfQ.DcungLS2D0-V5FlObrYQNV283QRSfZfrw3c0RHFR02Q";

const headers = { TokenCybersoft: TOKEN_CYBERSOFT };

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    showingMovies: 0,
    comingMovies: 0,
    hotMovies: 0,
    totalUsers: 0,
    totalTheaters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi 3 API song song
      const [moviesRes, usersRes, theatersRes] = await Promise.all([
        // 1. Danh sách phim
        axios.get(`${API_BASE_URL}/QuanLyPhim/LayDanhSachPhim?maNhom=GP01`, { headers }),
        
        // 2. Danh sách người dùng
        axios.get(`${API_BASE_URL}/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01`, { headers }),
        
        // 3. Danh sách hệ thống rạp
        axios.get(`${API_BASE_URL}/QuanLyRap/LayThongTinHeThongRap`, { headers }),
      ]);

      const movies = moviesRes.data.content || [];
      const users = usersRes.data.content || [];
      const theaters = theatersRes.data.content || [];

      // Tính toán thống kê
      const showingMovies = movies.filter(m => m.dangChieu).length;
      const comingMovies = movies.filter(m => m.sapChieu).length;
      const hotMovies = movies.filter(m => m.hot).length;

      setStats({
        totalMovies: movies.length,
        showingMovies,
        comingMovies,
        hotMovies,
        totalUsers: users.length,
        totalTheaters: theaters.length,
      });

      // 5 phim mới nhất (sắp xếp theo mã phim giảm dần)
      const sortedMovies = [...movies].sort((a, b) => b.maPhim - a.maPhim);
      setRecentMovies(sortedMovies.slice(0, 5));

      // Top 5 phim điểm cao nhất
      const topRated = [...movies]
        .sort((a, b) => (b.danhGia || 0) - (a.danhGia || 0))
        .slice(0, 5);
      setTopRatedMovies(topRated);

    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.response?.data?.content || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Đang tải dữ liệu từ API...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <i className="fas fa-chart-line me-2 text-primary"></i>
                Dashboard Movie
              </h2>
              <p className="text-muted mb-0">
                Dữ liệu từ API: <code>movienew.cybersoft.edu.vn</code>
              </p>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchDashboardData}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Stats Cards - Hàng 1 */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-primary bg-opacity-10">
                  <i className="fas fa-film text-primary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Tổng phim</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.totalMovies}</h3>
                  <small className="text-success">
                    <i className="fas fa-database me-1"></i>
                    Từ API
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-success bg-opacity-10">
                  <i className="fas fa-play-circle text-success"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Đang chiếu</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.showingMovies}</h3>
                  <small className="text-success">
                    <i className="fas fa-check-circle me-1"></i>
                    Active
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-info bg-opacity-10">
                  <i className="fas fa-clock text-info"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Sắp chiếu</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.comingMovies}</h3>
                  <small className="text-info">
                    <i className="fas fa-hourglass-half me-1"></i>
                    Upcoming
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-danger bg-opacity-10">
                  <i className="fas fa-fire text-danger"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Phim Hot</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.hotMovies}</h3>
                  <small className="text-danger">
                    <i className="fas fa-fire-flame-curved me-1"></i>
                    Trending
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Hàng 2 */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-warning bg-opacity-10">
                  <i className="fas fa-users text-warning"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Người dùng</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.totalUsers}</h3>
                  <Link to="/admin/users" className="text-warning small">
                    Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          <div className="card border-0 shadow-sm h-100 dashboard-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 stat-icon bg-secondary bg-opacity-10">
                  <i className="fas fa-building text-secondary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1 small fw-medium text-uppercase">Hệ thống rạp</p>
                  <h3 className="mb-0 fw-bold text-dark">{stats.totalTheaters}</h3>
                  <small className="text-muted">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    Cinema chains
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phim mới & Top rated */}
      <div className="row g-4">
        {/* Phim mới nhất */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-clock me-2 text-primary"></i>
                  Phim mới thêm
                </h5>
                <Link to="/admin/movies" className="btn btn-sm btn-outline-primary">
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentMovies.length === 0 ? (
                <p className="text-muted text-center">Không có phim</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentMovies.map((movie) => (
                    <div key={movie.maPhim} className="list-group-item px-0 py-3 border-0">
                      <div className="d-flex align-items-center">
                        <img
                          src={movie.hinhAnh}
                          alt={movie.tenPhim}
                          className="rounded"
                          width="50"
                          height="70"
                          style={{ objectFit: "cover" }}
                          onError={(e) => e.target.src = "https://via.placeholder.com/50x70?text=No+Img"}
                        />
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-semibold">{movie.tenPhim}</h6>
                          <p className="mb-0 text-muted small">
                            <i className="fas fa-calendar me-1"></i>
                            {formatDate(movie.ngayKhoiChieu)}
                          </p>
                        </div>
                        <div className="text-end">
                          {movie.dangChieu && (
                            <span className="badge bg-success">Đang chiếu</span>
                          )}
                          {movie.sapChieu && (
                            <span className="badge bg-info">Sắp chiếu</span>
                          )}
                          {movie.hot && (
                            <span className="badge bg-danger ms-1">Hot</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top phim điểm cao */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-star me-2 text-warning"></i>
                Top phim điểm cao
              </h5>
            </div>
            <div className="card-body">
              {topRatedMovies.length === 0 ? (
                <p className="text-muted text-center">Không có dữ liệu</p>
              ) : (
                <div className="list-group list-group-flush">
                  {topRatedMovies.map((movie, index) => (
                    <div key={movie.maPhim} className="list-group-item px-0 py-3 border-0">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <span className={`badge bg-${
                            index === 0 ? 'warning' : index === 1 ? 'secondary' : index === 2 ? 'danger' : 'light text-dark'
                          } rounded-pill px-3 py-2`}>
                            #{index + 1}
                          </span>
                        </div>
                        <img
                          src={movie.hinhAnh}
                          alt={movie.tenPhim}
                          className="rounded mx-3"
                          width="50"
                          height="70"
                          style={{ objectFit: "cover" }}
                          onError={(e) => e.target.src = "https://via.placeholder.com/50x70?text=No+Img"}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{movie.tenPhim}</h6>
                          <div className="text-warning">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < Math.round((movie.danhGia || 0) / 2) ? '' : 'text-muted'}`}></i>
                            ))}
                            <span className="text-muted ms-2 small">
                              {movie.danhGia || 0}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}