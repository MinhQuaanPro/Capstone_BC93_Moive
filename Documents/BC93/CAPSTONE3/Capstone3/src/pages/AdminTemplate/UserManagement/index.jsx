import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("https://apistore.cybersoft.edu.vn/api/Users/admin", {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      const data = await response.json();
      setUsers(data.content || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Quản lý người dùng</h2>
        <Link to="/admin/add-user" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Thêm người dùng
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Avatar</th>
                  <th>Email</th>
                  <th>Tên</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id || index}>
                      <td>{index + 1}</td>
                      <td><img src={user.avatar || "https://via.placeholder.com/40"} alt="" width="40" className="rounded-circle" /></td>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{user.phone || "N/A"}</td>
                      <td><span className="badge bg-success">Active</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}