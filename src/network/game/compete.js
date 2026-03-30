import { request } from 'network/request'

// 查询体育竞技贡献数据
export function listCompete(query) {
  return request({
    url: '/api/game/compete/list',
    method: 'get',
    params: query
  })
}

