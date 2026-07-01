import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Dùng useNavigate thay Navigate
import { authLogin } from "./slice";
import { useDispatch, useSelector } from "react-redux";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅
  const state = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // ✅ Redirect khi đã login - dùng useEffect với dependency
  useEffect(() => {
    if (state.data) {
      navigate("/admin", { replace: true }); // ✅ replace: true để không loop
    }
  }, [state.data, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authLogin(credentials));
  };

  // ✅ Xóa cái Navigate component này đi
  // if (state.data) {
  //   return <Navigate to="/admin" />;
  // }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow" style={{ width: 420 }}>
        <div className="card-body p-4">
          <h4 className="card-title text-center mb-4 fw-bold text-primary">
            🎬 Admin Login
          </h4>

          {state.error && (
            <div className="alert alert-danger py-2 mb-3">
              {state.error.response?.data?.content || 
               state.error.message || 
               "Đăng nhập thất bại"}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="email@example.com"
                onChange={handleChange}
                value={credentials.email}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Mật khẩu</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                onChange={handleChange}
                value={credentials.password}
                required
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="btn btn-primary w-100"
            >
              {state.loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}