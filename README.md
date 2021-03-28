# 项目说明

此项目为门户网站导航，主要功能包括：

1. 网站查询，领域，分组，收藏置顶
2. 网站带账户信息跳转
3. 网站管理，增删改查
4. 用户管理，增删改查与授权角色
5. 角色管理，增删改查与授权网站

## 项目开发说明

- 安装 [node](https://nodejs.org/zh-cn/), 版本 v12.18 及以上长期支持版(LTS)
- 安装依赖 `npm install`
- 启动项目 `npm run serve`
- 构建项目 `npm run build`

### 项目架构

- 项目脚手架[vue-cli](https://cli.vuejs.org/zh/guide/)
- 项目库[vue](https://cn.vuejs.org/v2/guide/)
- 项目路由[vue-vouter](https://router.vuejs.org/zh/installation.html)
- 项目数据管理[vuex](https://vuex.vuejs.org/zh/)
- 项目 UI 库[ant-design-vue](https://www.antdv.com/docs/vue/introduce-cn/)
- 项目类型管理[typescript](https://www.typescriptlang.org/)

### 项目规范检测

```
npm run lint
```

### 自定义配置

查看 [Configuration Reference](https://cli.vuejs.org/config/).

## 项目目录结构

├── README.md
├── babel.config.js
├── package.json
├── package-lock.json
├── public                          # 公共资源目录
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue                     # 页面主入口文件
│   ├── api                         # 请求配置
│   │   ├── baseUrl.ts              # 请求地址配置
│   │   ├── errorHandle.ts          # 请求异常处理
│   │   └── index.ts                # 请求实现
│   ├── assets                      # 静态资源
│   ├── components                  # 组件
│   │   ├── Header.vue
│   │   └── WebList.vue
│   ├── main.ts                     # 启动文件
│   ├── router                      # 页面路由
│   │   └── index.ts
│   ├── shims-tsx.d.ts              # vue-ts 配置
│   ├── shims-vue.d.ts              # vue-ts 配置
│   ├── store                       # vuex 配置
│   │   ├── constant.ts             # 常量
│   │   └── index.ts
│   ├── util                        # 工具
│   └── views                       # 页面
│         ├── Favorites.vue         # 收藏页
│         ├── Home.vue              # 首页
│         ├── Login.vue             # 登录页
│         └── manager               # 管理页面
├── tsconfig.json                   # ts-配置
└── vue.config.js                   # vue-配置

### 开发新页面流程

#### 普通页面

1. 在`src/views/`下创建新页面
2. 在`src/store/index.ts`下配置数据
3. 在`src/router/index.ts`下「第一级」添加路由

#### 管理页面

1. 管理页面在`src/views/manager/`下创建新页面
2. 在`src/store/index.ts`下配置数据
3. 在`src/router/index.ts`下「manager/children」添加路由

### 注意事项

1. 项目数据主要在 store 中管理 `src/store/index.ts`
2. 用户是否有访问管理平台权限，在登录后判断 `src/views/Login.vue`
