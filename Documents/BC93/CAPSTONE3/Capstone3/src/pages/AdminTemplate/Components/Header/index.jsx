import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Auth/slice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/admin">ADMIN PANEL</a>
        <div className="navbar-nav me-auto">
          <a className="nav-link" href="/admin">Dashboard</a>
          <a className="nav-link" href="/admin/add-user">Thêm người dùng</a>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">{user?.hoTen || "Admin"}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}