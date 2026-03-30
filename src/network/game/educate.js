import { request } from 'network/request'

// 查询体教融合贡献奖
export function listEducate(query) {
  return request({
    url: '/api/game/educate/list',
    method: 'get',
    params: query
  })
}

