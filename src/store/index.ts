import Vue from "vue";
import Vuex from "vuex";
import { message } from "ant-design-vue";

import { getUserInfo } from "@/util";
import fetchApi from "@/api/index";
import { Options } from "./constant";

Vue.use(Vuex);

const initialList = {
  rows: [],
  current: 1,
  size: "10",
};
export default new Vuex.Store({
  state: {
    options: Options,
    deptTree: [],
    fields: [],
    websitesAll: [],
    groupsAll: { ...initialList },
    groups: { ...initialList },
    websites: { ...initialList },
    favorites: { ...initialList },
    users: { ...initialList },
    roles: { ...initialList },
    searchName:"",//搜索信息
    systemName:"",//平台搜索信息
    sceneSearchName:"",//场景搜索信息
    fieldSearch:"",//领域搜索信息
    fieldSearchName:'',//领域页面搜索信息
    userSearchName:"",//用户搜索信息
  },
  mutations: {
    setFieldTree(state, data) {
      state.fields = data;
    },
    setsearchName(state,data){
      state.searchName=data
    },
    setuserSearchName(state,data){
      state.userSearchName=data
    },
    setsystemName(state,data){
      state.systemName=data
    },
    setsceneSearchName(state,data){
      state.sceneSearchName=data
    },
    setfieldSearch(state,data){
      state.fieldSearch=data
    },
    setfieldSearchName(state,data){
      state.fieldSearchName=data
    },
    setGroup(state, data) {
      data.size = data.size + "";
      state.groups = data;
    },
    setGroupAll(state, data) {
      data.size = data.size + "";
      state.groupsAll = data;
    },
    setDeptTree(state, data) {
      state.deptTree = data;
    },
    setWebsites(state, data) {
      data.size = data.size + "";
      state.websites = data;
    },
    setWebsitesAll(state, data) {
      state.websitesAll = data;
    },
    setFavorites(state, data) {
      data.size = data.size + "";
      state.favorites = data;
    },
    setUsers(state, data) {
      data.size = data.size + "";
      state.users = data;
    },
    setRoles(state, data) {
      data.size = data.size + "";
      state.roles = data;
    },
  },
  actions: {
    // 组织类别
    queryDeptTree(context) {
      fetchApi({
        apiPath: "/tsysuser/tsysGroup/allByTree",
      }).then((result) => {
        context.commit("setDeptTree", result.data);
      });
    },
    // 类型列表（领域）
    queryFieldTree(context, params) {
      fetchApi({
        apiPath: "/baseField/queryUserList",
        params,
      }).then((result) => {
        context.commit("setFieldTree", result.data);
      });
    },
    // 分组列表
    queryGroup(context, params) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/baseGroup/queryUserGroupList",
        params: {
          userId,
          current: 1,
          size: 10,
          ...params,
        },
      }).then((result) => {
        console.log(result);
        context.commit("setGroup", result.data);
      });
    },
    queryGroupAll(context, params) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/baseGroup/queryUserGroupList",
        params: {
          userId,
          current: 1,
          size: 200,
          ...params,
        },
      }).then((result) => {
        context.commit("setGroupAll", result.data);
        console.log(result);
        const { rows, total } = result.data;
        if (rows.length < total) {
          context.dispatch("queryGroupAll", { size: total });
        }
      });
    },
    // 新增分组
    addGroup(context, params) {
      const { userId } = getUserInfo();
      fetchApi({
        method: "post",
        apiPath: "/baseGroup/addWebsiteGroupUser",
        params: {
          userId,
          ...params,
        },
      }).then(() => {
        message.success("添加成功");
        context.dispatch("queryGroup");
        context.dispatch("queryWebsite");
      });
    },
    // 更新分组
    // updateGroup(context, params) {
    //   fetchApi({
    //     method: "put",
    //     apiPath: "/baseGroup/updateWebsiteGroupUser",
    //     params,
    //   }).then(() => {
    //     message.success("修改成功");
    //     context.dispatch("queryGroup");
    //   });
    // },
    // 删除分组
    delGroup(context, groupId) {
      fetchApi({
        method: "delete",
        apiPath: `/baseGroup/delUserGroupById/${groupId}`,
      }).then(() => {
        message.success("删除成功");
        context.dispatch("queryGroup");
      });
    },
    // 查询网站列表
    queryWebsite(context, params = {}) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/websiteinfo/queryWebsiteInfo",
        params: {
          userId,
          isPassword: 1,
          current: 1,
          size: 10,
          // websiteName:params.websiteName,
          ...params,
        },
      }).then((result) => {
        context.commit("setWebsites", result.data);
      });
    },
    queryWebsiteSys(context, params = {}) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/websiteinfo/queryWebsiteSysInfo",
        params: {
          userId,
          isPassword: 1,
          current: 1,
          size: 10,
          ...params,
        },
      }).then((result) => {
        context.commit("setWebsites", result.data);
      });
    },
    queryWebsiteAll(context, params = {}) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/websiteinfo/websiteByUserId",
        params: {
          userId,
          ...params,
        },
      }).then((result) => {
        context.commit("setWebsitesAll", result.data);
      });
    },
    // 给网站添加分组
    addWebsiteGroup(context, params) {
      const { userId } = getUserInfo();
      console.log(params);
      fetchApi({
        apiPath: "/baseGroup/putWebsiteGroupById",
        params: {
          userId,
          websiteId: params.websiteId.join(","),
          groupId: params.groupId.join(","),
        },
      }).then(() => {
        context.dispatch("queryWebsite");
      });
    },
    addWebsiteGroupOne(context, params) {
      const { userId } = getUserInfo();
      console.log(params);
      fetchApi({
        apiPath: "/baseGroup/putWebsiteGroupByWebsiteId",
        params: {
          userId,
          websiteId: params.websiteId.join(","),
          groupId: params.groupId.join(","),
        },
      }).then(() => {
        context.dispatch("queryWebsite");
      });
    },
    // 网站置顶
    addWebsiteTop(context, id) {
      fetchApi({
        method: "put",
        apiPath: `/websiteinfo/top/${id}`,
      }).then(() => {
        message.success("置顶成功");
        context.dispatch("queryWebsite");
      });
    },
    // 网站取消置顶
    delWebsiteTop(context, id) {
      fetchApi({
        method: "put",
        apiPath: `/websiteinfo/cancelTop/${id}`,
      }).then(() => {
        message.success("取消置顶");
        context.dispatch("queryWebsite");
      });
    },
    // 新增网站
    // addWebsite(context, tWebsiteInfoVo) {
    //   fetchApi({
    //     method: "post",
    //     apiPath: `/websiteinfo/savewebsiteinfo`,
    //     params: tWebsiteInfoVo,
    //   }).then(() => {
    //     message.success("添加成功");
    //     context.dispatch("queryWebsite");
    //   });
    // },
    // 更新网站
    // updateWebsite(context, tWebsiteInfoVo) {
    //   fetchApi({
    //     method: "put",
    //     apiPath: `/websiteinfo/updatewebsiteinfo`,
    //     params: tWebsiteInfoVo,
    //   }).then(() => {
    //     message.success("更新成功");
    //     context.dispatch("queryWebsite");
    //   });
    // },
    // 删除网站
    delWebsite(context, id) {
      fetchApi({
        method: "delete",
        apiPath: `/websiteinfo/deletewebsiteinfoById/${id}`,
      }).then(() => {
        message.success("删除成功");
        context.dispatch("queryWebsite");
      });
    },
    // 查询收藏列表
    queryFavorites(context, params) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: `/websiteinfo/queryCollection`,
        params: {
          userId,
          current: 1,
          size: 10,
          ...params,
        },
      }).then((result) => {
        context.commit("setFavorites", result.data);
      });
    },
    // 添加收藏
    addFavorites(context, websiteId) {
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: `/websiteCollection/addCollection`,
        params: {
          userId,
          websiteId,
        },
      }).then(() => {
        message.success("收藏成功");
        context.dispatch("queryWebsite");
      });
    },
    // 取消收藏
    delFavorites(context, params) {
      console.log(params);
      const { userId } = getUserInfo();
      fetchApi({
        method: "delete",
        apiPath: `/websiteCollection/delUserById`,
        params: {
          userId,
          websiteId: params.id,
        },
      }).then(() => {
        message.success("取消收藏");
        if (params.isFavorite) context.dispatch("queryFavorites");
        else context.dispatch("queryWebsite");
      });
    },
    delFavoritesOne(context, params) {
      console.log(params);
      const { userId } = getUserInfo();
      fetchApi({
        method: "delete",
        apiPath: `/websiteCollection/delUserById`,
        params: {
          userId,
          websiteId: params,
        },
      }).then(() => {
        message.success("取消收藏");
        context.dispatch("queryFavorites");
      });
    },
    // 查询用户列表
    queryUser(context, params) {
      fetchApi({
        apiPath: `/tsysuser/selectUser`,
        params: {
          current: 1,
          size: 10,
          ...params,
        },
      }).then((result) => {
        context.commit("setUsers", result.data);
      });
    },
    // 添加用户
    // addUser(context, params) {
    //   fetchApi({
    //     method: "post",
    //     apiPath: `/tsysuser/register`,
    //     params,
    //   }).then(() => {
    //     message.success("添加成功");
    //     context.dispatch("queryUser");
    //   });
    // },
    // 更新用户信息
    // updateUser(context, params) {
    //   fetchApi({
    //     method: "put",
    //     apiPath: `/tsysuser/update`,
    //     params,
    //   }).then(() => {
    //     message.success("更新成功");
    //     context.dispatch("queryUser");
    //   });
    // },
    // 用户授权
    // authUser(context, params) {
    //   fetchApi({
    //     method: "post",
    //     apiPath: `/tUseRole/addRoleUser`,
    //     params,
    //   }).then(() => {
    //     message.success("授权成功");
    //     context.dispatch("queryUser");
    //   });
    // },
    // 删除用户
    delUser(context, id) {
      fetchApi({
        method: "delete",
        apiPath: `/tsysuser/delete`,
        params: {
          ids: id.join(","),
        },
      }).then(() => {
        message.success("删除成功");
        context.dispatch("queryUser");
      });
    },
    // 用户重置密码
    resetPassword(context, userId) {
      fetchApi({
        method: "get",
        apiPath: `/tsysuser/resetPassword`,
        params: {
          userIds: userId.join(","),
        },
      }).then(() => {
        message.success("重置密码成功");
        context.dispatch("queryUser");
      });
    },
    // 查询角色列表
    queryRole(context, params) {
      fetchApi({
        apiPath: `/tRole/queryUserRoleList`,
        params: {
          current: 1,
          size: 10,
          ...params,
        },
      }).then((result) => {
        context.commit("setRoles", result.data);
      });
    },
    // 添加角色
    // addRole(context, params) {
    //   fetchApi({
    //     method: "post",
    //     apiPath: `/tRole/addWebsiteRoleUser`,
    //     params,
    //   }).then(() => {
    //     message.success("添加成功");
    //     context.dispatch("queryRole");
    //   });
    // },
    // 更新角色
    // updateRole(context, params) {
    //   fetchApi({
    //     method: "put",
    //     apiPath: `/tRole/updateRole`,
    //     params,
    //   }).then(() => {
    //     message.success("修改成功");
    //     context.dispatch("queryRole");
    //   });
    // },
    // 删除角色
    delRole(context, roleId) {
      fetchApi({
        method: "delete",
        apiPath: `/tRole/delUserRoleById/${roleId}`,
      }).then(() => {
        message.success("删除成功");
        context.dispatch("queryRole");
      });
    },
  },
  modules: {
    typeManger: {
      state: () => ({
        fields: { ...initialList },
      }),
      mutations: {
        setFieldList(state, data) {
          data.size = data.size + "";
          state.fields = data;
        },
      },
      actions: {
        // 类型列表（领域）
        queryFieldList(context, params) {
          fetchApi({
            apiPath: "/baseField/queryFieldList",
            params: {
              current: 1,
              size: 10,
              ...params,
            },
          }).then((result) => {
            context.commit("setFieldList", result.data);
          });
        },
        // addFieldList(context, params) {
        //   fetchApi({
        //     method: "post",
        //     apiPath: "/baseField/addWebsiteUser",
        //     params,
        //   }).then(() => {
        //     message.success("添加成功");
        //     context.dispatch("queryFieldList");
        //   });
        // },
        // updateFieldList(context, params) {
        //   fetchApi({
        //     method: "put",
        //     apiPath: `/baseField/updateWebsiteUser`,
        //     params,
        //   }).then(() => {
        //     message.success("修改成功");
        //     context.dispatch("queryFieldList");
        //   });
        // },
        delFieldList(context, fieldId) {
          fetchApi({
            method: "delete",
            apiPath: `/baseField/delUserById/${fieldId}`,
          }).then(() => {
            message.success("删除成功");
            context.dispatch("queryFieldList");
          });
        },
      },
    },
    logManger: {
      state: () => ({
        logs: { ...initialList },
      }),
      mutations: {
        setWebLogs(state, data) {
          data.size = data.size + "";
          state.logs = data;
        },
      },
      actions: {
        queryWebLogs(context, params) {
          fetchApi({
            apiPath: "/log/jumpLog",
            params: {
              current: 1,
              size: 10,
              ...params,
            },
          }).then((result) => {
            context.commit("setWebLogs", result.data);
          });
        },
      },
    },
  },
});
