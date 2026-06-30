import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoom, toggleSeat, submitBooking } from "./bookingSlice";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { showtimeId } = useParams();
  const dispatch = useDispatch();
  const { room, selectedSeats, loading, error } = useSelector(
    (state) => state.booking,
  );

  useEffect(() => {
    dispatch(fetchRoom(showtimeId));
  }, [dispatch, showtimeId]);

  const handleBooking = () => {
    const token = localStorage.getItem("accessToken");
    dispatch(submitBooking({ showtimeId, seats: selectedSeats, token }))
      .unwrap()
      .then(() => {
        alert("🎉 Đặt vé thành công!");
      })
      .catch(() => {
        alert("❌ Đặt vé thất bại, vui lòng thử lại!");
      });
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = room?.danhSachGhe.find((g) => g.maGhe === seatId);
    return sum + (seat ? seat.giaVe : 0);
  }, 0);

  if (loading)
    return <p className="text-center mt-10">Đang tải sơ đồ ghế...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!room)
    return <p className="text-center mt-10">Không có dữ liệu phòng vé</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-6 pt-20 max-w-6xl mx-auto">
      {/* Thông tin phim */}
      <div className="text-center mb-6 bg-white shadow-md rounded-lg p-6 border border-indigo-200">
        <h2 className="text-3xl font-bold text-indigo-700">
          {room.thongTinPhim.tenPhim}
        </h2>
        <p className="text-gray-800 font-medium">
          {room.thongTinPhim.tenCumRap} - {room.thongTinPhim.ngayChieu}{" "}
          {room.thongTinPhim.gioChieu}
        </p>
      </div>

      {/* Bố cục 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: sơ đồ ghế */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
          <h3 className="text-lg font-semibold mb-4 text-center text-indigo-600">
            🎟️ Sơ đồ ghế
          </h3>

          {/* Thanh chú thích trạng thái ghế */}
          <div className="flex justify-center items-center gap-8 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded"></div>
              <span>Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span>Đang chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <span>Trống</span>
            </div>
          </div>

          {/* Grid ghế */}
          <div className="grid grid-cols-10 gap-3 justify-items-center">
            {room.danhSachGhe.map((seat) => (
              <button
                key={seat.maGhe}
                disabled={seat.daDat}
                onClick={() => dispatch(toggleSeat(seat.maGhe))}
                className={`w-12 h-12 rounded-lg text-base font-bold border flex items-center justify-center transition transform hover:scale-105
                ${
                  seat.daDat
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : selectedSeats.includes(seat.maGhe)
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white border-indigo-300 hover:bg-indigo-100 text-indigo-700"
                }`}
              >
                <span className="opacity-70 text-gray-600">{seat.tenGhe}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cột phải: thanh toán (sticky) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200 flex flex-col justify-between md:sticky md:top-24 h-fit">
          <div>
            <h3 className="text-2xl font-extrabold mb-6 text-center text-indigo-700 uppercase tracking-wide">
              💳 Thanh toán
            </h3>

            {/* Thông tin suất chiếu */}
            <div className="mb-4 text-gray-700 text-base leading-relaxed">
              <p>
                <span className="font-semibold">🎬 Phim:</span>{" "}
                {room.thongTinPhim.tenPhim}
              </p>
              <p>
                <span className="font-semibold">🏢 Rạp:</span>{" "}
                {room.thongTinPhim.tenCumRap}
              </p>
              <p>
                <span className="font-semibold">📅 Ngày chiếu:</span>{" "}
                {room.thongTinPhim.ngayChieu}
              </p>
              <p>
                <span className="font-semibold">⏰ Giờ chiếu:</span>{" "}
                {room.thongTinPhim.gioChieu}
              </p>
            </div>

            {/* Ghế đã chọn */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">
                🪑 Ghế đã chọn:{" "}
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "Chưa chọn"}
              </p>
            </div>

            {/* Ưu đãi */}
            <div className="mb-4">
              <p className="text-green-600 font-semibold">
                🎁 Ưu đãi: Giảm 10% cho thành viên
              </p>
            </div>

            {/* Tổng tiền */}
            <div className="mb-4 text-center bg-indigo-50 border border-indigo-300 rounded-lg p-4">
              <p className="text-3xl font-extrabold text-indigo-700">
                💰 Tổng tiền:{" "}
                <span className="text-red-600">
                  {totalPrice.toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
            </div>
          </div>

          {/* Nút thanh toán */}
          <button
            onClick={handleBooking}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-10 py-3 rounded-lg shadow-lg transition font-semibold mt-6 text-lg"
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
