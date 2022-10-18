import request from '../request';

/** 自定义部分 */
export async function getToken(body: any, options?: any) {
  return request.post('/api/user/token', {
    ...(options || {}),
    data: body,
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body?: API.LoginParams, options?: any) {
  return request.post('/api/user/login/account', {
    ...(options || {}),
    // data: body,
  });
}

/** 获取文章列表 /api/article/page */
export async function getArticlePage(body: any, options?: any) {
  // const { current, pageSize, ...rest } = body;
  return request.post('/api/article/getPage', {
    data: body,
    ...(options || {}),
  });
}

// 分类枚举
export async function fetchArticleCategoryList(body?: any, options?: any) {
  return request.post(' /api/article/category/list', {
    ...(options || {}),
    data: body,
  });
}

// 文章分类page
export async function fetchArticleCategoryPage(body: any, options?: any) {
  const { current, pageSize, ...rest } = body;
  return request.post('/api/article/category/page', {
    data: {
      current,
      pageSize,
      ...rest,
    },
    ...(options || {}),
  });
}

// 分类枚举
export async function deleteArticleCategory(ids: string, options?: any) {
  return request.delete(' /api/article/category/remove/' + ids, {
    ...(options || {}),
  });
}
