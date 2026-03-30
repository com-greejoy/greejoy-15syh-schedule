import { request } from 'network/request'

// 查询比赛项目裁判
export function listJudge(query) {
  return request({
    url: '/api/game/judge/list',
    method: 'get',
    params: query
  })
}
