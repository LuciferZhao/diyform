<template>
  <transition name="error" appear>
    <el-alert
      style="transition: 0.18s linear; height: 2.5em; margin: 1.5% 0 0"
      :title="title"
      type="error"
      show-icon
    >
    </el-alert>
  </transition>
</template>

<script>
export default {
  name: "Reusable",
  props: ["title"],
};
</script>

<style scoped>
/* 进入的起点、离开的终点 */
.error-enter,
.error-leave-to {
  transform: translateX(100%);
}
/* 进入的终点、离开的起点 */
.error-enter-to,
.error-leave {
  transform: translateX(0);
}
</style>