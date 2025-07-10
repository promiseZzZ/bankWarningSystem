# Vue 3 + TypeScript + Vite
### author:promise
### theBankWarningSystem front-end

该系统设计了登录注册、性能监控、告警记录、性能分析、离线分析、实时分析、用户管理、节点管理八个页面。

在该前端目录中：
1.node_modules存放了npm 加载的项目依赖模块。

2.public存放了静态资源。

3.src为要开发的目录，基本上要做的事情都在这个目录里。里面包含了几个目录及文件：

&emsp;&emsp;assets: 存放了一些图片以及地图json文件。

  components: 存放了可复用的组件文件，包含auth（登录注册修改密码表单），charts（各种图表）。

  layouts：存放了页面的基本布局，包含登录注册界面以及主界面。

  plugins：存放了vuetify配置文件。

  router：存放了路由以及路由配置。

  scss：存放了界面的样式。

  store：存放了users，一个保存：状态、业务逻辑的实体。

  theme：存放了一个主题。

  utils：存放了auth.ts，即token管理工具，request.ts，即创建了一个配置好的Axios HTTP客户端实例，并设置了请求/响应拦截器。

  views：存放了页面，包含auth（注册登录页面），dashboard（性能监控、告警记录、性能分析、离线分析、实时分析、用户管理、节点管理页面），pages（404页面）。

  App.vue:项目的入口文件。

  main.ts:项目的核心文件。

4.index.html为首页入口文件。

5.一些配置文件。
  
  

