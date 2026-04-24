import { request } from 'network/request'

export function listHonor(query) {
  return request({
    url: '/api/game/honor/list',
    method: 'get',
    params: query
  })
}
