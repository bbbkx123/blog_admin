import request from 'umi-request';
import { message } from 'antd';
import { history } from '@umijs/max';

request.interceptors.request.use((url, options: any) => {
  let _options = { ...options };
  if (url !== '/api/user/token') {
    _options = {
      ..._options,
      headers: {
        ..._options.headers,
        Authorization: localStorage.getItem('token') as string,
      },
    };
  }
  return {
    url: `${url}`,
    options: { ..._options, interceptors: true },
  };
});

request.interceptors.response.use((response, opt: any) => {
  const { status } = response;
  // console.log('interceptors.response --> opt', opt);
  // console.log('interceptors.response --> response', response);

  if (status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/user/login');
    message.warning('身份凭证过期，请重新登录');
  }

  return response;
});

export default request;
