import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById, updateMovie, clearError, clearMovieDetail } from "./slice";

export default function EditMovie() {
  const { maPhim } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, movieDetail, error } = useSelector((state) => state.movieManagement);

  const [movieData, setMovieData] = useState({
    maPhim: "",
    tenPhim: "",
    trailer: "",
    moTa: "",
    maNhom: "GP01",
    ngayKhoiChieu: "",
    sapChieu: false,
    dangChieu: false,
    hot: false,
    danhGia: 5,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ VALIDATE MAPHIM NGAY
  useEffect(() => {
    console.log("🎬 EditMovie - maPhim from URL:", maPhim);
    console.log("🎬 Type:", typeof maPhim);
    console.log("🎬 Is undefined?", maPhim === undefined);
    
    if (!maPhim || maPhim === "undefined" || maPhim === "null" || maPhim === "") {
      console.error("❌ Invalid maPhim:", maPhim);
      alert("❌ Mã phim không hợp lệ! Vui lòng quay lại danh sách phim và chọn phim cần sửa.");
      navigate("/admin/movies");
      return;
    }
    
    // Kiểm tra xem maPhim có phải là số không
    const movieId = parseInt(maPhim);
    if (isNaN(movieId)) {
      console.error("❌ maPhim is not a number:", maPhim);
      alert("❌ Mã phim phải là số!");
      navigate("/admin/movies");
      return;
    }
    
    console.log("✅ Valid maPhim:", movieId);
    dispatch(getMovieById(movieId));
    
    return () => {
      dispatch(clearMovieDetail());
    };
  }, [maPhim, dispatch, navigate]);

  useEffect(() => {
    if (movieDetail) {
      console.log("📥 Movie detail loaded:", movieDetail);
      console.log("📥 maPhim:", movieDetail.maPhim);
      
      // Parse ngày từ API (dd/MM/yyyy hoặc ISO) sang yyyy-MM-dd
      let parsedDate = "";
      if (movieDetail.ngayKhoiChieu) {
        if (movieDetail.ngayKhoiChieu.includes("/")) {
          const parts = movieDetail.ngayKhoiChieu.split("/");
          if (parts.length === 3) {
            parsedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        } else {
          parsedDate = new Date(movieDetail.ngayKhoiChieu).toISOString().split("T")[0];
        }
      }
      
      setMovieData({
        maPhim: movieDetail.maPhim || "",
        tenPhim: movieDetail.tenPhim || "",
        trailer: movieDetail.trailer || "",
        moTa: movieDetail.moTa || "",
        maNhom: movieDetail.maNhom || "GP01",
        ngayKhoiChieu: parsedDate,
        sapChieu: movieDetail.sapChieu || false,
        dangChieu: movieDetail.dangChieu || false,
        hot: movieDetail.hot || false,
        danhGia: movieDetail.danhGia || 5,
      });
      
      if (movieDetail.hinhAnh) {
        setImagePreview(movieDetail.hinhAnh);
      }
    }
  }, [movieDetail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📤 Submitting update...");
    console.log("📤 movieData:", movieData);
    console.log("📤 maPhim:", movieData.maPhim);
    
    if (!movieData.maPhim) {
      alert("❌ Thiếu mã phim! Vui lòng tải lại trang.");
      return;
    }
    
    if (!movieData.tenPhim.trim()) {
      alert("❌ Vui lòng nhập tên phim!");
      return;
    }
    
    if (!movieData.ngayKhoiChieu) {
      alert("❌ Vui lòng chọn ngày khởi chiếu!");
      return;
    }
    
    // Format ngày từ yyyy-MM-dd sang dd/MM/yyyy
    const dateParts = movieData.ngayKhoiChieu.split("-");
    const formattedNgayKhoiChieu = dateParts.length === 3 
      ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
      : movieData.ngayKhoiChieu;
    
    const formData = {
      ...movieData,
      ngayKhoiChieu: formattedNgayKhoiChieu,
      hinhAnh: imageFile,
    };
    
    console.log("📤 Formatted data:", formData);

    try {
      await dispatch(updateMovie(formData)).unwrap();
      alert("✅ Cập nhật phim thành công!");
      navigate("/admin/movies");
    } catch (err) {
      console.error("❌ Update error:", err);
      console.error("❌ Response:", err?.response?.data);
      console.error("❌ Status:", err?.response?.status);
      
      let errorMessage = "Cập nhật phim thất bại!";
      
      if (err?.response?.status === 401) {
        errorMessage = "❌ Lỗi xác thực! Token không hợp lệ hoặc đã hết hạn.";
      } else if (err?.response?.status === 404) {
        errorMessage = "❌ Không tìm thấy phim! Mã phim có thể không tồn tại.";
      } else if (err?.content) {
        errorMessage = `❌ ${err.content}`;
      } else if (err?.message) {
        errorMessage = `❌ ${err.message}`;
      }
      
      alert(errorMessage);
    }
  };

  if (loading && !movieDetail) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Đang tải thông tin phim...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="fas fa-edit me-2 text-primary"></i>
          Chỉnh sửa phim
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error?.content || error?.message || "Có lỗi xảy ra"}
          <button className="btn-close" onClick={() => dispatch(clearError())}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Thông tin phim</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã phim</label>
                  <input
                    type="text"
                    className="form-control"
                    value={movieData.maPhim}
                    readOnly
                    disabled
                  />
                  <small className="text-muted">Mã phim không thể thay đổi</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên phim *</label>
                  <input
                    type="text"
                    name="tenPhim"
                    className="form-control"
                    value={movieData.tenPhim}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Trailer URL</label>
                  <input
                    type="url"
                    name="trailer"
                    className="form-control"
                    value={movieData.trailer}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mô tả</label>
                  <textarea
                    name="moTa"
                    className="form-control"
                    rows="4"
                    value={movieData.moTa}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Ngày khởi chiếu *
                    </label>
                    <input
                      type="date"
                      name="ngayKhoiChieu"
                      className="form-control"
                      value={movieData.ngayKhoiChieu}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">
                      Sẽ gửi: {movieData.ngayKhoiChieu ? `${movieData.ngayKhoiChieu.split("-").reverse().join("/")}` : "dd/MM/yyyy"}
                    </small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Đánh giá (1-10)
                    </label>
                    <input
                      type="number"
                      name="danhGia"
                      className="form-control"
                      min="1"
                      max="10"
                      value={movieData.danhGia}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Trạng thái</h5>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="sapChieu"
                    checked={movieData.sapChieu}
                    onChange={handleChange}
                    id="sapChieu"
                  />
                  <label className="form-check-label" htmlFor="sapChieu">
                    Sắp chiếu
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="dangChieu"
                    checked={movieData.dangChieu}
                    onChange={handleChange}
                    id="dangChieu"
                  />
                  <label className="form-check-label" htmlFor="dangChieu">
                    Đang chiếu
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="hot"
                    checked={movieData.hot}
                    onChange={handleChange}
                    id="hot"
                  />
                  <label className="form-check-label" htmlFor="hot">
                    Phim Hot
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Hình ảnh</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Thay đổi hình poster
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Để trống nếu không muốn thay đổi. Tối đa 5MB.
                  </small>
                </div>

                {imagePreview && (
                  <div className="text-center mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Cập nhật phim
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => navigate("/admin/movies")}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}