import { request } from 'network/request'

// 查询立项阶段的竞赛项目
export function listInitRace(query) {
  return request({
    url: '/api/game/race/list/init',
    method: 'get',
    params: query
  })
}

// 查询竞赛项目
export function listGameRace(query) {
  return request({
    url: '/api/game/race/list/game',
    method: 'get',
    params: query
  })
}

// 查询比赛日期
export function listMatchDate(query) {
  return request({
    url: '/api/game/race/list/matchDate',
    method: 'get',
    params: query
  })
}

// 查询项目比赛日期
export function listItemMatchDate(query) {
  return request({
    url: '/api/game/race/list/matchDate/item',
    method: 'get',
    params: query
  })
}
