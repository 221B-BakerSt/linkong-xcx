import request from "@/utils/request";

/**
 * 查询园区简介列表
 * @returns {Promise<ResponseData<unknown>>}
 */
export function getParkIntroduction(params) {
    return request({
        url: "/operations/parkIntroduction/list",
        method: "get",
        params,
    });
}

export function getParkMeetingRoomList(params) {
    return request({
        url: "/operations/matchingMeetingRoom/list",
        method: "get",
        params,
    });
}
export function getParkMeetingRoomDetail(meetingRoomId) {
    return request({
        url: "/operations/matchingMeetingRoom/" + meetingRoomId,
        method: "get",
    });
}
export function deleteParkMeetingRoom(params) {
    return request({
        url: "/operations/matchingMeetingRoom/" + meetingRoomId,
        method: "delete",
        params,
    });
}
export function updateParkMeetingRoom(params) {
    return request({
        url: "/operations/matchingMeetingRoom",
        method: "put",
        params,
    });
}
export function addParkMeetingRoom(params) {
    return request({
        url: "/operations/matchingMeetingRoom",
        method: "post",
        params,
    });
}

/**
 * 查询园区公寓列表
 */
export function getParkApartment(params) {
    return request({
        url: "/operations/matchingApartment/list",
        method: "get",
        params,
    });
}

/**
 * 园区公寓详情
 */
export function getParkApartmentDetail(apartmentId) {
    return request({
        url: "/operations/matchingApartment/" + apartmentId,
        method: "get",
    });
}

/**
 * 园区健身房列表
 */
export function getParkGymList(params) {
    return request({
        url: "/operations/matchingGym/list",
        method: "get",
        params,
    });
}

/**
 * 园区健身房详情
 */
export function getParkGymDetail(gymId) {
    return request({
        url: "/operations/matchingGym/" + gymId,
        method: "get",
    });
}

/**
 * 园区银行列表
 */
export function getParkBankList(params) {
    return request({
        url: "/operations/matchingBank/list",
        method: "get",
        params,
    });
}

/**
 * 园区银行详情
 */
export function getParkBankDetail(bankId) {
    return request({
        url: "/operations/matchingBank/" + bankId,
        method: "get",
    });
}

/**
 * 园区餐厅列表
 */
export function getParkRestaurantList(params) {
    return request({
        url: "/operations/matchingRestaurant/list",
        method: "get",
        params,
    });
}

/**
 * 园区餐厅详情
 */
export function getParkRestaurantDetail(restaurantId) {
    return request({
        url: "/operations/matchingRestaurant/" + restaurantId,
        method: "get",
    });
}

/**
 * 园区超市列表
 */
export function getParkMarketList(params) {
    return request({
        url: "/operations/matchingMarket/list",
        method: "get",
        params,
    });
}

/**
 * 园区超市详情
 */
export function getParkMarketDetail(marketId) {
    return request({
        url: "/operations/matchingMarket/" + marketId,
        method: "get",
    });
}

/**
 * 园区文印店列表
 */
export function getParkPrintshopList(params) {
    return request({
        url: "/operations/matchingPrintshop/list",
        method: "get",
        params,
    });
}

/**
 * 园区文印店详情
 */
export function getParkPrintshopDetail(printshopId) {
    return request({
        url: "/operations/matchingPrintshop/" + printshopId,
        method: "get",
    });
}

/**
 * 查询通知公告列表
 */
export function getNoticeList(params) {
    return request({
        url: "/system/notice/list",
        method: "get",
        params,
    });
}

/**
 * 获取通知公告详情
 */
export function getNoticeDetail(noticeId) {
    return request({
        url: "/system/notice/" + noticeId,
        method: "get",
    });
}

export function getStarEnterpriseList(params) {
    return request({
        url: "/operations/enterprise/list",
        method: "get",
        params,
    });
}

export function getParkRecruitList(params) {
    return request({
        url: "/operations/parkRecruit/list",
        method: "get",
        params,
    });
}

/**
 * 查询园区资讯列表
 */
export function getParkInfoList(params) {
    return request({
        url: "/operations/parkInfo/list",
        method: "get",
        params,
    });
}

// 查询园区资讯详情
export function getParkInfoDetail(infoId) {
    return request({
        url: "/operations/parkInfo/" + infoId,
        method: "get",
    });
}
// 获取明星企业详情

export function getStarEnterpriseDetail(starEnterpriseId) {
    return request({
        url: "/operations/enterprise/" + starEnterpriseId,
        method: "get",
    });
}

// 查询园区企聘详情
export function getParkRecruitDetail(recruitId) {
    return request({
        url: "/operations/parkRecruit/" + recruitId,
        method: "get",
    });
}



//查询企业基础信息列表
export function corporateList(params) {
  return request({
    url: '/operations/enterpriseBaseInfo/list',
    method: 'GET',
    params
  });
}
//查询企业基础信息详情
export function getCorporateDetail(id) {
  return request({
    url: '/operations/enterpriseBaseInfo/' + id,
    method: 'GET'
  });
}
//新增企业基础信息
export function addCorporateOld(data) {
  return request({
    url: '/operations/enterpriseInfo',
    method: 'POST',
    data
  });
}
//查询企业基础信息列表
export function getCorporateList(params) {
  return request({
    url: '/operations/enterpriseInfo/list',
    method: 'GET',
    params
  });
}
export function getCorporateInfo(id) {
  return request({
    url: '/operations/enterpriseInfo/' + id,
    method: 'GET'
  });
}
// 获取合同列表
export function getContractList(params) {
  return request({
    url: '/buiness/contractAlert/list',
    method: 'GET',
    params
  });
}
// 获取合同详情
export function getContractDetail(id) {
  return request({
    url: '/buiness/contractAlert/' + id,
    method: 'GET'
  });
}
// 账单预警
export function getZhangDanList(params, data) {
  return request({
    url: '/billAlert/getQueryAll',
    method: 'POST',
    params,
    data
  });
}
// 账单预警详情
export function getZhangDanDetail(params) {
  return request({
    url: '/billAlert/getOneBill',
    method: 'POST',
    params
  });
}
// 查询房源预约列表
export function getHouseReserveList(params) {
  return request({
    url: '/operations/appointment/list',
    method: 'GET',
    params
  });
}
// 查询房源预约详情
export function getHouseReserveDetail(id) {
  return request({
    url: '/operations/appointment/' + id,
    method: 'GET'
  });
}

// 查询公寓预约记录
export function getReserveList(params) {
  return request({
    url: '/apartmentBooking/list',
    method: 'GET',
    params
  });
}
// 查询会议室预约列表
export function getMeetingRoomList(params) {
  return request({
    url: '/operations/meetingRoomBooking/list',
    method: 'GET',
    params
  });
}
// 查询会议室预约详情
export function getMeetingRoomDetail(bookingId) {
  return request({
    url: '/operations/meetingRoomBooking/' + bookingId,
    method: 'GET'
  });
}

//查询未绑定房间信息列表
export function getAvailableRoomList(params) {
  return request({
    url: '/operations/lkroom/list',
    method: 'GET',
    params: params
  });
}
//查询未绑定房间信息详情
export function getAvailableRoomDetail(id) {
  return request({
    url: '/operations/lkroom/' + id,
    method: 'GET'
  });
}
//新增预约房源
export function addHouseReserve(data) {
  return request({
    url: '/operations/appointment',
    method: 'POST',
    data
  });
}
// 轮播图
export function getCarouselList() {
  return request({
    url: '/operations/parkBanner/list',
    method: 'GET',
  });
}
