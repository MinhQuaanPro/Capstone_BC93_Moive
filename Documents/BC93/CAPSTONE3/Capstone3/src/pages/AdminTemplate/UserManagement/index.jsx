import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersService, deleteUserService } from "./slice";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.userManagement);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsersService());
  }, [dispatch]);

  const handleDelete = (taiKhoan) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${taiKhoan}"?`)) {
      dispatch(deleteUserService(taiKhoan));
    }
  };

  const filteredUsers = state.data?.filter((user) =>
    user.taiKhoan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="fas fa-users me-2"></i>
          Quản lý người dùng
        </h2>
        <Link to="/admin/add-user" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Thêm người dùng
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tài khoản, họ tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading - Dùng Bootstrap spinner thay Loader */}
      {state.loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="alert alert-danger">
          {state.error.response?.data?.content || "Có lỗi xảy ra"}
        </div>
      )}

      {/* Table */}
      {!state.loading && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">STT</th>
                    <th className="px-4 py-3">Tài khoản</th>
                    <th className="px-4 py-3">Họ tên</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Số điện thoại</th>
                    <th className="px-4 py-3">Loại</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!filteredUsers || filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user.taiKhoan}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 fw-semibold">
                          {user.taiKhoan}
                        </td>
                        <td className="px-4 py-3">{user.hoTen}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.soDt}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge ${
                              user.maLoaiNguoiDung === "QuanTri"
                                ? "bg-danger"
                                : "bg-success"
                            }`}
                          >
                            {user.maLoaiNguoiDung === "QuanTri"
                              ? "Quản trị"
                              : "Khách hàng"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              to={`/admin/edit-user/${user.taiKhoan}`}
                              className="btn btn-sm btn-warning"
                            >
                              <i className="fas fa-edit"></i> Sửa
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(user.taiKhoan)}
                            >
                              <i className="fas fa-trash"></i> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!state.loading && filteredUsers && (
        <div className="mt-3 text-muted">
          <small>
            Tổng số: <strong>{filteredUsers.length}</strong> người dùng
          </small>
        </div>
      )}
    </div>
  );
}