import request from '@/utils/request'

export function getBoilerOperationRecords(params) {
  return request({
    url: '/operations/assetBoilerOpRecord/list',
    method: 'GET',
    params
  })
}

export function getSewageTreatmentRecords(params) {
  return request({
    url: '/operations/assetSewageTreatmentRecord/list',
    method: 'GET',
    params
  })
}
