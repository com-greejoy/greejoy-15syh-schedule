import { request } from 'network/request'

// 查询比赛项目列表
export function listItem(query) {
  return request({
    url: '/api/game/item/list',
    method: 'get',
    params: query
  })
}

// 查询比赛项目信息
export function getItem(categoryId, id) {
  return request({
    url: `/api/game/item/${categoryId}/${id}`,
    method: 'get'
  })
}
