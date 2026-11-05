import request from "@/utils/request";

export const medicalAppointmentApi = {
  getRooms() { return request({ url: "/app/medicalAppointment/rooms", method: "get" }); },
  getSlots(medicalRoomId, bookingDate) {
    return request({ url: "/app/medicalAppointment/slots", method: "get", params: { medicalRoomId, bookingDate } });
  },
  getClosures() { return request({ url: "/app/medicalAppointment/closures", method: "get" }); },
  reserve(data) { return request({ url: "/app/medicalAppointment/reserve", method: "post", data }); },
  getMyAppointments(params = {}) { return request({ url: "/app/medicalAppointment/myAppointments", method: "get", params }); },
  getManagementScope() { return request({ url: "/app/medicalAppointment/managementScope", method: "get" }); },
  getAppointments(params = {}) { return request({ url: "/app/medicalAppointment/appointments", method: "get", params, skipParkId: true }); },
  getAppointment(appointmentId) { return request({ url: `/app/medicalAppointment/appointments/${appointmentId}`, method: "get" }); },
  cancel(appointmentId) { return request({ url: `/app/medicalAppointment/cancel/${appointmentId}`, method: "put" }); },
};
