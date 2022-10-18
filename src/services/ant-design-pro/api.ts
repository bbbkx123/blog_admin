// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function testtt(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/test', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/*******************************************************************************/

/** 获取文章列表 /api/article/add */
export async function addOrEditArticle(body: any, options?: { [key: string]: any }) {
  return request<API.ArticleList>('/api/article/insertOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string,
    },
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 删除规则 DELETE */
export async function removeArticle(paramStr: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/article/remove/' + paramStr, {
    method: 'DELETE',
    ...(options || {}),
    headers: {
      Authorization: localStorage.getItem('token') as string,
    },
  });
}

// 修改文章状态
export async function updateStatus(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(' /api/article/updateStatus', {
    method: 'POST',
    ...(options || {}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string,
    },
    data: body,
  });
}

export async function addOrEditArticleCategory(body: any, options?: { [key: string]: any }) {
  return request<API.ArticleList>('/api/article/category/insertOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') as string,
    },
    data: {
      ...body,
    },
    ...(options || {}),
  });
}
