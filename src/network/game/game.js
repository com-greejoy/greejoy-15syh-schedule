import { request } from 'network/request'

// 查询比赛
export function listOpenGame(query) {
  return request({
    url: '/api/game/game/list/open',
    method: 'get',
    params: query
  })
}
