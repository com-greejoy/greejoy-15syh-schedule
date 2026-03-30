import { request } from 'network/request'

// 查询比赛组别信息
export function getCategory(id) {
  return request({
    url: `/api/game/category/${id}`,
    method: 'get'
  })
}
