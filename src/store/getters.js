const getters = {
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    token: (state) => state.user.token,
    userInfo: (state) => state.user.userInfo,
    roles: (state) => state.user.roles,
    permission_routes: (state) => state.permission.routes,
    visitedViews: (state) => state.tagsView.visitedViews,
    cachedViews: (state) => state.tagsView.cachedViews,
    sidebarRouters: (state) => state.permission.sidebarRouters,
    messegeNum: (state) => state.user.messageInfo.count,  //未读消息数
}
export default getters
