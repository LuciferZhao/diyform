<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
    <!-- <show-datas></show-datas> -->
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ShowDatas from "./components/page/ShowDatas.vue";

export default {
  name: "App",
  components: {
    ShowDatas,
  },
  methods: {
    urlFilter() {
      // 访问路径是填写问卷页面
      if (this.$route.name === "ShowQuestionnaire") {
        // 在组件内验证：发布状态、是否截止、cookie
      }
      // 访问路径不是登录页面
      else if (this.$route.name !== "Login") {
        // 判断是否已保存cookie,若无直接跳转登陆页面
        if (Cookies.get("userInfo") === undefined) {
          this.$router.replace({
            name: "Login",
          });
        }
      }
      // 访问路径是登录页面
      else {
        // 判断是否已保存cookie,若有直接跳转至首页
        if (Cookies.get("userInfo") !== undefined) {
          this.$router.replace({
            name: "UserIndex",
          });
        }
      }
    },
  },
  created() {
    this.$bus.$on("urlFilter", this.urlFilter);
    this.$bus.$emit("urlFilter");
  },
  beforeDestroy() {
    this.$bus.$off("urlFilter");
  },
};
</script>

<style>
</style>
