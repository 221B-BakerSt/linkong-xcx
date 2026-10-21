import request from "@/utils/request";

export const shuttleBusApi = {
  getConfig() {
    return request({
      url: "/app/shuttleBus/config",
      method: "get",
    });
  },

  getSchedules() {
    return request({
      url: "/app/shuttleBus/schedules",
      method: "get",
    });
  },

  reserve(data) {
    return request({
      url: "/app/shuttleBus/reserve",
      method: "post",
      data,
    });
  },

  authorizeWechat(data) {
    return request({
      url: "/app/shuttleBus/wechat/authorize",
      method: "post",
      data,
    });
  },

  getMyReservations(params = {}) {
    return request({
      url: "/app/shuttleBus/myReservations",
      method: "get",
      params,
    });
  },

  getReservationInfo(reservationId) {
    return request({
      url: `/app/shuttleBus/reservation/${reservationId}`,
      method: "get",
    });
  },

  payReservation(reservationId) {
    return request({
      url: `/app/shuttleBus/pay/${reservationId}`,
      method: "post",
    });
  },

  cancelReservation(reservationId) {
    return request({
      url: `/app/shuttleBus/cancel/${reservationId}`,
      method: "put",
    });
  },

  refundReservation(reservationId) {
    return request({
      url: `/app/shuttleBus/refund/${reservationId}`,
      method: "put",
    });
  },
};
