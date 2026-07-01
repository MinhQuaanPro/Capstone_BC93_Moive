import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRoom, bookTicket } from "../../services/bookingService";

export const fetchRoom = createAsyncThunk("booking/fetchRoom", async (showtimeId) => {
  const res = await getRoom(showtimeId);
  return res.data.content;
});

export const submitBooking = createAsyncThunk("booking/submitBooking", async ({ showtimeId, seats, token }) => {
  const res = await bookTicket({
    maLichChieu: showtimeId,
    danhSachVe: seats.map(id => ({ maGhe: id, giaVe: 75000 }))
  }, token);
  return res.data;
});

const bookingSlice = createSlice({
  name: "booking",
  initialState: { room: null, selectedSeats: [] },
  reducers: {
    toggleSeat: (state, action) => {
      const seatId = action.payload;
      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter(id => id !== seatId);
      } else {
        state.selectedSeats.push(seatId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoom.fulfilled, (state, action) => {
      state.room = action.payload;
    });
  },
});

export const { toggleSeat } = bookingSlice.actions;
export default bookingSlice.reducer;
