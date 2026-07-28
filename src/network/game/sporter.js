import { request } from 'network/request'

// 查询比赛运动员
export function listGameSporter(query) {
  return request({
    url: '/api/game/sporter/list/game',
    method: 'get',
    params: query
  })
}

// 查询参赛运动员
export function getJoinSporter(categoryId, sporterId) {
  return request({
    url: `/api/game/sporter/join/${categoryId}/${sporterId}`,
    method: 'get'
  })
}

// 查询参赛运动员（按自然人ID，合并所有参赛身份的赛程和成绩）
export function getJoinSporterByAthlete(categoryId, athleteId) {
  return request({
    url: `/api/game/sporter/join-by-athlete/${categoryId}/${athleteId}`,
    method: 'get'
  })
}
