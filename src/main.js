import Vue from "vue";
import App from "./App.vue";

// 引入Vue-Router
import VueRouter from "vue-router";
// 引入路由器
import router from "./router/index";
// 引入插件
import vueResource from "vue-resource";
// 全局引入 element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入VueWechatTitle插件:用于动态修改浏览器标题
import VueWechatTitle from "vue-wechat-title";
// 用于复制链接
import VueClipboard from "vue-clipboard2";
// 引入echarts
import * as echarts from "echarts";

// 使用插件
Vue.use(VueRouter);
Vue.use(vueResource);
Vue.use(ElementUI);
Vue.use(VueWechatTitle);
Vue.use(VueClipboard);
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this; //安装全局事件总线，$bus就是当前应用的vm
  },
}).$mount("#app");
