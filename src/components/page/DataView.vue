<template>
  <div id="DataView">
    <!-- 导航栏 -->
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
      </el-menu>
    </el-header>

    <!-- 页面主体 -->
    <el-main>
      <ShowDatas v-if="menuActive === '数据'"></ShowDatas>
      <Bar v-else-if="menuActive === '报表'"></Bar>
    </el-main>
  </div>
</template>

<script>
import ShowDatas from "./ShowDatas.vue";
import Bar from "./Bar.vue";

export default {
  name: "DataView",
  components: { ShowDatas, Bar },
  data() {
    return {
      menuDefaultActive: "数据",
      menus: ["数据", "报表"],
      menuActive: "数据",
    };
  },
  methods: {
    // 导航栏选中项
    menuHandleSelect(key, keyPath) {
      this.menuActive = key;
    },
  },
};
</script>

<style scoped>
#DataView {
  margin: 1% 10%;
}
</style>