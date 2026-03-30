import { request } from "network/request";

// 查询文章列表
export function listArticle(query) {
  return request({
    url: "/api/cms/article/listChildren",
    method: "get",
    params: query
  });
}
