import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile, logout, userUpdateProfile } from "./userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Đang tải thông tin...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10">Chưa có dữ liệu người dùng</p>;

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = {
      taiKhoan: user.taiKhoan,
      matKhau: e.target.matKhau.value,
      email: e.target.email.value,
      soDt: e.target.soDt.value,
      maNhom: "GP01",
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      hoTen: e.target.hoTen.value,
    };
    dispatch(userUpdateProfile(formData));
    setActiveTab("info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 font-semibold ${
              activeTab === "info"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            THÔNG TIN CÁ NHÂN
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 font-semibold ml-2 ${
              activeTab === "history"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            LỊCH SỬ ĐẶT VÉ
          </button>
          {activeTab === "edit" && (
            <button
              className="px-6 py-2 font-semibold ml-2 bg-indigo-600 text-white"
              disabled
            >
              CẬP NHẬT THÔNG TIN
            </button>
          )}
        </div>

        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center border-r md:border-r-2 border-indigo-100 pr-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Avatar"
                className="w-32 h-32 rounded-full shadow-md mb-4"
              />
              <h2 className="text-xl font-bold text-indigo-700">{user.hoTen}</h2>
              <p className="text-sm text-gray-600">{user.maLoaiNguoiDung}</p>
              <div className="mt-6 w-full">
                <button
                  onClick={() => setActiveTab("edit")}
                  className="w-full py-2 px-4 mb-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Cập nhật thông tin
                </button>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
            <div className="md:col-span-2 pl-4">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">📋 Thông tin cá nhân</h3>
              <div className="space-y-4">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Số điện thoại:</strong> {user.soDT}</p>
                <p><strong>Tài khoản:</strong> {user.taiKhoan}</p>
                <p><strong>Loại người dùng:</strong> {user.maLoaiNguoiDung}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-6">🎟️ Lịch sử đặt vé</h3>
            {user.thongTinDatVe && user.thongTinDatVe.length > 0 ? (
              <div className="space-y-6">
                {user.thongTinDatVe.map((ve, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <p className="font-semibold text-indigo-600">{ve.tenPhim}</p>
                    <p className="text-gray-700">Ngày chiếu: {ve.ngayDat} - Giờ: {ve.gioChieu}</p>
                    <p className="text-gray-700">Rạp: {ve.tenRap}</p>
                    <p className="text-gray-700">Ghế: {ve.danhSachGhe.map((g) => g.tenGhe).join(", ")}</p>
                    <p className="text-red-600 font-bold">Giá vé: {ve.giaVe?.toLocaleString("vi-VN")} VNĐ</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Bạn chưa có lịch sử đặt vé nào.</p>
            )}
          </div>
        )}

        {activeTab === "edit" && (
          <div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-6">✏️ Cập nhật thông tin cá nhân</h3>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Họ tên</label>
                <input name="hoTen" defaultValue={user.hoTen} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email</label>
                <input name="email" defaultValue={user.email} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Số điện thoại</label>
                <input name="soDt" defaultValue={user.soDT} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mật khẩu</label>
                <input name="matKhau" type="password" className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                  Lưu thay đổi
                </button>
                <button type="button" onClick={() => setActiveTab("info")} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
