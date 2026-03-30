import { request } from 'network/request'

// 查询报表类型
export function listSheetType(query) {
  return request({
    url: '/api/game/sheet/list/type',
    method: 'get',
    params: query
  })
}

// 查询比赛报表列表
export function listGameSheet(query) {
  return request({
    url: '/api/game/sheet/list/game',
    method: 'get',
    params: query
  })
}

// 查询项目报表列表
export function listItemSheet(query) {
  return request({
    url: '/api/game/sheet/list/item',
    method: 'get',
    params: query
  })
}

// 查询竞赛项目报表列表
export function listRaceSheet(query) {
  return request({
    url: '/api/game/sheet/list/race',
    method: 'get',
    params: query
  })
}
