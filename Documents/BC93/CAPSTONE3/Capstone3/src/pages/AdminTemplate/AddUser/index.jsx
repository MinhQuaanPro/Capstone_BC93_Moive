import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./slice";

export default function AddUser() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.addUser);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    maLoaiNguoiDung: "KhachHang",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success || error) dispatch(clearMessage());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      setFormData({
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
        maNhom: "GP01",
        maLoaiNguoiDung: "KhachHang",
      });
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4 fw-bold">Thêm người dùng</h4>
      <div className="row">
        <div className="col-md-8">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Tài khoản</label>
              <input name="taiKhoan" type="text" className="form-control" value={formData.taiKhoan} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input name="matKhau" type="password" className="form-control" value={formData.matKhau} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Họ tên</label>
              <input name="hoTen" type="text" className="form-control" value={formData.hoTen} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input name="soDt" type="text" className="form-control" value={formData.soDt} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mã nhóm</label>
              <input name="maNhom" type="text" className="form-control" value={formData.maNhom} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Loại người dùng</label>
              <select name="maLoaiNguoiDung" className="form-select" value={formData.maLoaiNguoiDung} onChange={handleChange}>
                <option value="KhachHang">Khách hàng</option>
                <option value="QuanTri">Quản trị</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm người dùng"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}