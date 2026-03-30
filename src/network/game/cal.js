import { request } from 'network/request'

// 统计奖牌名次
export function calUnitTypeMedal(query) {
  return request({
    url: '/api/game/cal/medal/unitType',
    method: 'get',
    params: query
  })
}

// 统计奖牌名次
export function calItemMedal(query) {
  return request({
    url: '/api/game/cal/medal/item',
    method: 'get',
    params: query
  })
}

// 统计总分名次
export function calUnitTypeScore(query) {
  return request({
    url: '/api/game/cal/score/unitType',
    method: 'get',
    params: query
  })
}

// 统计总分名次
export function calItemScore(query) {
  return request({
    url: '/api/game/cal/score/item',
    method: 'get',
    params: query
  })
}

// 统计奖牌名次（竞技体育贡献）
export function calUnitTypeCompete(query) {
  return request({
    url: '/api/game/cal/compete/unitType',
    method: 'get',
    params: query
  })
}

// 统计奖牌名次（体教融合贡献奖）
export function calUnitTypeEducate(query) {
  return request({
    url: '/api/game/cal/educate/unitType',
    method: 'get',
    params: query
  })
}
