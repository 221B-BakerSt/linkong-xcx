import request from "@/utils/request";

export const medicalAppointmentApi = {
  getRooms() { return request({ url: "/app/medicalAppointment/rooms", method: "get" }); },
  getSlots(medicalRoomId, bookingDate) {
    return request({ url: "/app/medicalAppointment/slots", method: "get", params: { medicalRoomId, bookingDate } });
  },
  reserve(data) { return request({ url: "/app/medicalAppointment/reserve", method: "post", data }); },
  getMyAppointments(params = {}) { return request({ url: "/app/medicalAppointment/myAppointments", method: "get", params }); },
  cancel(appointmentId) { return request({ url: `/app/medicalAppointment/cancel/${appointmentId}`, method: "put" }); },
};
