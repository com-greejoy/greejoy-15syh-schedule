import { request } from 'network/request'

// 查询比赛区域单位
export function listUnitType(query) {
  return request({
    url: '/api/game/unitType/list',
    method: 'get',
    params: query
  })
}

// 查询比赛区域单位
export function getUnitType(categoryId, unitTypeId) {
  return request({
    url: `/api/game/unitType/${categoryId}/${unitTypeId}`,
    method: 'get'
  })
}
