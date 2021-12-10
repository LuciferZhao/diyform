<template>
  <div id="UserIndex">
    <el-container>
      <!-- Header -->
      <el-header>
        <!-- 菜单栏 -->
        <el-menu
          :default-active="menuDefaultActive"
          class="el-menu-demo"
          mode="horizontal"
          @select="menuHandleSelect"
        >
          <!-- 菜单项 -->
          <el-menu-item v-for="menu in menus" :key="menu" :index="menu">
            {{ menu }}
          </el-menu-item>
          <!-- 右侧用户信息及操作 -->
          <el-dropdown style="float: right">
            <!-- 显示用户名 -->
            <el-button type="primary">
              您好，{{ username }} ！
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 下拉操作 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exitLogin">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-header>

      <!-- Main -->
      <el-main>
        <el-button
          style="float: right"
          type="primary"
          round
          @click="createQuestionnaire"
        >
          新建问卷
        </el-button>
        <div class="flex-container" v-show="questionnaires.length !== 0">
          <ReusableFlexContainer
            v-for="(questionnaire, indexQ) in questionnaires"
            :key="indexQ"
            :paperId="questionnaire.paperId"
            :title="questionnaire.paperTitle"
            :submitTimes="questionnaire.submitTimes"
            :stateCode="questionnaire.paperStatus"
          >
          </ReusableFlexContainer>
        </div>
        <el-empty
          v-show="questionnaires.length === 0"
          style="clear: both"
          description="您还未发布过表单"
        >
        </el-empty>
      </el-main>

      <!-- Footer -->
      <el-footer>
        <el-divider></el-divider>
        <span class="spanCenter">持续更新中~</span>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import ReusableFlexContainer from "./../reusable/ReusableFlexContainer.vue";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "UserIndex",
  components: { ReusableFlexContainer },
  data() {
    return {
      menuDefaultActive: "我的表单",
      menus: ["我的表单"],
      menuActive: "我的表单",
      username: "",
      questionnaires: [],
    };
  },
  methods: {
    // 导航栏选中项
    menuHandleSelect(key, keyPath) {
      this.menuActive = key;
    },
    // 新建问卷
    createQuestionnaire() {
      this.$router.push({
        name: "CreateQuestionnaire",
      });
    },
    // 退出登录
    exitLogin() {
      Cookies.remove("userInfo");
      this.$router.replace({
        name: "Login",
      });
    },
  },
  created() {
    // 获取用户名
    this.username = JSON.parse(Cookies.get("userInfo")).username;

    // 接收问卷列表
    {
      // 配置请求参数：
      // 1.请求路径
      let url =
        "http://127.0.0.1:8084/tybar/paper/indexPapers/" +
        JSON.parse(Cookies.get("userInfo")).id;
      // 2.传给后端的数据
      // 3.其他配置
      let configs = {
        headers: {
          "Content-Type": "application/json;multipart/form-data;charset=UTF-8",
        },
      };
      // 发送请求
      axios.get(url, null, configs).then(
        (response) => {
          this.questionnaires = response.data.data;
        },
        (error) => {
          this.$notify({
            showClose: true,
            title: "表单信息获取失败：",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
        }
      );
    }
  },
};
</script>

<style>
#UserIndex {
  margin: 1% 10%;
}
.spanCenter {
  display: block;
  text-align: center;
}
.flex-container {
  clear: both;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
}
</style>