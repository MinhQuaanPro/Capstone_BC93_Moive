import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMovie, clearError } from "./slice";

export default function AddMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.movieManagement);

  const [movieData, setMovieData] = useState({
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Format ngày từ yyyy-MM-dd sang dd/MM/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Format lại ngày trước khi gửi
    const formattedData = {
      ...movieData,
      ngayKhoiChieu: formatDate(movieData.ngayKhoiChieu),
      hinhAnh: imageFile,
    };

    console.log("📤 Sending data:", formattedData);

    try {
      await dispatch(addMovie(formattedData)).unwrap();
      alert("✅ Thêm phim thành công!");
      navigate("/admin/movies");
    } catch (err) {
      console.error("❌ Error:", err);
      console.error("❌ Response:", err.response?.data);
      console.error("❌ Status:", err.response?.status);
      
      const errorMessage = err?.content 
        || err?.message 
        || err.response?.data?.content
        || "Thêm phim thất bại! Kiểm tra console để biết chi tiết.";
      
      alert(`❌ Lỗi: ${errorMessage}`);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="fas fa-plus-circle me-2 text-primary"></i>
          Thêm phim mới
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
        <div className="alert alert-danger">
          {error?.content || error?.message || "Có lỗi xảy ra"}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Thông tin phim</h5>

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
                      Sẽ được format thành: {formatDate(movieData.ngayKhoiChieu) || "dd/MM/yyyy"}
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
                    Upload hình poster
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {imagePreview && (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
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
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Lưu phim
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