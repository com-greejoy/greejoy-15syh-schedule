import { request } from 'network/request'

// 查询超破纪录
export function listExtraResult(query) {
  return request({
    url: '/api/game/result/list/extra',
    method: 'get',
    params: query
  })
}

// 查询竞赛成绩
export function listResult(query) {
  return request({
    url: '/api/game/result/list',
    method: 'get',
    params: query
  })
}
