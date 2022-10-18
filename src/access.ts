/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  // console.log('access --> initialState --> ', initialState);

  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    // adminRouteFilter: () => isAdmin,
    adminRouteFilter: (routes: any) => {
      // console.log('adminRouteFilter --> ', routes);

      return true;
    },
  };
}
