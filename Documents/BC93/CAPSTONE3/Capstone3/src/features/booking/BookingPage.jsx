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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-6 pt-20 max-w-4xl mx-auto pt-5">
      <div className="text-center mb-6 bg-white shadow-md rounded-lg p-6 border border-indigo-200">
        <h2 className="text-3xl font-bold text-indigo-700">
          {room.thongTinPhim.tenPhim}
        </h2>
        <p className="text-gray-800 font-medium">
          {room.thongTinPhim.tenCumRap} - {room.thongTinPhim.ngayChieu}{" "}
          {room.thongTinPhim.gioChieu}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
        <h3 className="text-lg font-semibold mb-4 text-center text-indigo-600">
          Sơ đồ ghế
        </h3>

        {/* Thanh chú thích trạng thái ghế */}
        <div className="flex justify-center items-center gap-8 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-danger rounded"></div>
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-success rounded"></div>
            <span>Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray rounded"></div>
            <span>Trống</span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-3 justify-items-center">
          {room.danhSachGhe.map((seat) => (
            <button
              key={seat.maGhe}
              disabled={seat.daDat}
              onClick={() => dispatch(toggleSeat(seat.maGhe))}
              className={`w-12 h-12 rounded-lg text-base font-bold border flex items-center justify-center transition transform hover:scale-105
        ${
          seat.daDat
            ? "bg-danger text-white cursor-not-allowed"
            : selectedSeats.includes(seat.maGhe)
              ? "bg-success text-white shadow-md"
              : "bg-white border-indigo-300 hover:bg-indigo-100 text-indigo-700"
        }`}
            >
              <span className="opacity-70 text-gray-600">{seat.tenGhe}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="mb-3 text-lg font-medium text-gray-700">
          Ghế đã chọn:{" "}
          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
        </p>
        <p className="mb-3 text-lg font-semibold text-indigo-700">
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VNĐ
        </p>
        <button
          onClick={handleBooking}
          className="bg-danger from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-10 py-3 rounded-lg shadow-lg transition font-semibold"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
