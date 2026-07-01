import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, deleteMovie, clearError } from "./slice";
import { Link } from "react-router-dom";

export default function MovieManagement() {
  const dispatch = useDispatch();
  const { loading, movies, error } = useSelector((state) => state.movieManagement);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = async (maPhim, tenPhim) => {
    if (window.confirm(`Bạn có chắc muốn xóa phim "${tenPhim}"?`)) {
      try {
        await dispatch(deleteMovie(maPhim)).unwrap();
        alert("✅ Xóa phim thành công!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("❌ Xóa phim thất bại! " + (err?.content || err?.message || ""));
      }
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Helper để lấy movie ID
  const getMovieId = (movie) => {
    return movie.maPhim || movie.id || movie.MaPhim || 0;
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="fas fa-film me-2 text-primary"></i>
          Quản lý Phim
        </h2>
        <Link to="/admin/movies/add" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Thêm phim
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error?.content || error?.message || "Có lỗi xảy ra"}
          <button className="btn-close" onClick={() => dispatch(clearError())}></button>
        </div>
      )}

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên phim hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">Mã phim</th>
                    <th className="px-4 py-3">Hình ảnh</th>
                    <th className="px-4 py-3">Tên phim</th>
                    <th className="px-4 py-3">Mô tả</th>
                    <th className="px-4 py-3">Ngày khởi chiếu</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        Không có phim nào
                      </td>
                    </tr>
                  ) : (
                    filteredMovies.map((movie) => {
                      const movieId = getMovieId(movie);
                      
                      return (
                        <tr key={movieId}>
                          <td className="px-4 py-3">{movieId}</td>
                          <td className="px-4 py-3">
                            <img
                              src={movie.hinhAnh}
                              alt={movie.tenPhim}
                              className="rounded"
                              width="60"
                              height="90"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/60x90?text=No+Image";
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 fw-semibold">
                            {movie.tenPhim}
                          </td>
                          <td className="px-4 py-3">
                            <small className="text-muted">
                              {movie.moTa?.substring(0, 50)}...
                            </small>
                          </td>
                          <td className="px-4 py-3">
                            {formatDate(movie.ngayKhoiChieu)}
                          </td>
                          <td className="px-4 py-3">
                            {movie.dangChieu && (
                              <span className="badge bg-success me-1">
                                Đang chiếu
                              </span>
                            )}
                            {movie.sapChieu && (
                              <span className="badge bg-info me-1">
                                Sắp chiếu
                              </span>
                            )}
                            {movie.hot && (
                              <span className="badge bg-danger">Hot</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="d-flex justify-content-center gap-2">
                              {/* Nút Lịch chiếu - Màu xanh */}
                              <Link
                                to={`/admin/movies/showtime/${movieId}`}
                                className="btn btn-sm btn-info"
                                title="Tạo lịch chiếu"
                              >
                                <i className="fas fa-calendar-plus"></i>
                              </Link>
                              
                              {/* Nút Sửa - Màu vàng */}
                              <Link
                                to={`/admin/movies/edit/${movieId}`}
                                className="btn btn-sm btn-warning"
                                title="Sửa phim"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              
                              {/* Nút Xóa - Màu đỏ */}
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(movieId, movie.tenPhim)}
                                title="Xóa phim"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-muted">
        <small>
          Tổng số: <strong>{filteredMovies.length}</strong> phim
        </small>
      </div>
    </div>
  );
}