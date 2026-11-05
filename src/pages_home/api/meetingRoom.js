import request from "@/utils/request";

// 会议室预约相关接口
export const meetingRoomApi = {
    // 查询会议室列表（分页）
    getMeetingRoomList: (params = {}) => {
        return request({
            url: "/meetingRoom/getQueryAll",
            method: "get",
            params,
        });
    },

    // 查询所有会议室列表
    getAllMeetingRooms: () => {
        return request({
            url: "/meetingRoom/getQueryList",
            method: "get",
        });
    },

    // 获取会议室详情
    getMeetingRoomDetail: (id) => {
        return request({
            url: "/meetingRoom/MeetingRoomById",
            method: "post",
            data: { id },
        });
    },

    // 新增会议室
    addMeetingRoom: (data) => {
        return request({
            url: "/meetingRoom/addMeetingRoom",
            method: "post",
            data,
        });
    },

    // 修改会议室
    updateMeetingRoom: (data) => {
        return request({
            url: "/meetingRoom/updateMeetingRoom",
            method: "post",
            data,
        });
    },

    // 删除会议室
    removeMeetingRoom: (data) => {
        return request({
            url: "/meetingRoom/removeMeetingRoom",
            method: "post",
            data,
        });
    },

    // 查询会议室预约列表
    getBookingList: (params, pageQuery) => {
        return request({
            url: "/operations/meetingRoomBooking/list",
            method: "get",
            params: { ...params, ...pageQuery },
        });
    },

    // 新增会议室预约
    addBooking: (data) => {
        return request({
            url: "/operations/meetingRoomBooking",
            method: "post",
            data,
        });
    },

    // 修改会议室预约
    updateBooking: (data) => {
        return request({
            url: "/operations/meetingRoomBooking",
            method: "put",
            data,
        });
    },

    // 删除会议室预约
    deleteBooking: (bookingIds) => {
        return request({
            url: `/operations/meetingRoomBooking/${bookingIds}`,
            method: "delete",
        });
    },

    // 取消预约
    cancelBooking: (bookingId) => {
        return request({
            url: `/operations/meetingRoomBooking/cancel/${bookingId}`,
            method: "put",
        });
    },

    // 查询指定会议室某天的可用时间段
    getAvailableTimeSlots: (meetingRoomId, bookingDate, allTimeSlots) => {
        return request({
            url: `/operations/meetingRoomBooking/availableSlots/${meetingRoomId}`,
            method: "get",
            params: { bookingDate, allTimeSlots },
        });
    },

    // 查询我的预约列表
    getMyBookingList: (pageQuery) => {
        return request({
            url: "/operations/meetingRoomBooking/myList",
            method: "get",
            params: pageQuery,
        });
    },

    // 获取会议室预约详情
    getBookingInfo: (bookingId) => {
        return request({
            url: `/operations/meetingRoomBooking/${bookingId}`,
            method: "get",
        });
    },
};
