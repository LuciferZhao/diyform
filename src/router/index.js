// 该文件专门用于创建整个应用的路由器

// 引入VueRouter
import VueRouter from "vue-router";

// 引入组件
import Login from "./../components/page/Login.vue";
import UserIndex from "./../components/page/UserIndex.vue";
import EditQuestionnaire from "./../components/page/EditQuestionnaire.vue";
import ShowQuestionnaire from "./../components/page/ShowQuestionnaire.vue";
import DataView from "./../components/page/DataView.vue";

// 创建并暴露路由器
export default new VueRouter({
  mode: "history",
  routes: [
    {
      name: "Login",
      path: "/login",
      component: Login,
      meta: {
        title: "用户登录",
      },
    },
    {
      name: "UserIndex",
      path: "/",
      component: UserIndex,
      meta: {
        title: "我的表单",
      },
    },
    {
      name: "CreateQuestionnaire",
      path: "/editQuestionnaire",
      component: EditQuestionnaire,
      meta: {
        title: "创建表单",
      },
    },
    {
      name: "UpdateQuestionnaire",
      path: "/editQuestionnaire/:paperId",
      component: EditQuestionnaire,
      meta: {
        title: "更新表单",
      },
    },
    {
      name: "ShowQuestionnaire",
      path: "/showQuestionnaire/:paperId",
      component: ShowQuestionnaire,
      meta: {
        title: "表单填写",
      },
    },
    {
      name: "DataView",
      path: "/dataView/:paperId",
      component: DataView,
      meta: {
        title: "数据查看",
      },
    },
  ],
});
