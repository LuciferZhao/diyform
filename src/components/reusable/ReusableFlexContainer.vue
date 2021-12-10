<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <el-image style="width: 65%" :src="require('@/assets/questionnaire.png')">
    </el-image>
    <br />
    <div>
      <p>
        数据：
        <span class="number">{{ submitTimes }}</span>
      </p>

      <!-- 悬浮下拉选项 -->
      <el-dropdown style="float: right; margin: -10% 5% 0 0">
        <i class="el-icon-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editQuestionnaire(paperId)">
            编辑
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="publishQuestionnaire(paperId)"
            :disabled="stateCode === 1"
          >
            发布
          </el-dropdown-item>
          <el-dropdown-item @click.native="copyLink(paperId)">
            复制链接
          </el-dropdown-item>
          <el-dropdown-item @click.native="showDatas(paperId)"
            >数据查看</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="deleteQuestionnaire(paperId)"
            style="color: red"
          >
            删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReusableFlexContainer",
  props: ["paperId", "title", "submitTimes", "stateCode"],
  methods: {
    // 编辑问卷
    editQuestionnaire(paperId) {
      this.$router.push({
        name: "UpdateQuestionnaire",
        params: {
          paperId,
        },
      });
    },
    // 发布问卷
    publishQuestionnaire(paperId) {
      // 配置请求参数：
      // 1.请求路径
      let url = "http://127.0.0.1:8084/tybar/paper/publishStatus/" + paperId;
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
          this.$notify({
            showClose: true,
            title: "发布成功",
            message: "",
            type: "success",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
          location.reload();
        },
        (error) => {
          this.$notify({
            showClose: true,
            title: "发布失败：",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
        }
      );
    },
    // 删除问卷
    deleteQuestionnaire(paperId) {
      this.$confirm("问卷删除后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
        roundButton: true,
      })
        .then(() => {
          // 配置请求参数：
          // 1.请求路径
          let url = "http://127.0.0.1:8084/tybar/paper/delpaper/" + paperId;
          // 2.传给后端的数据
          // 3.其他配置
          let configs = {
            headers: {
              "Content-Type":
                "application/json;multipart/form-data;charset=UTF-8",
            },
          };
          // 发送请求
          axios.get(url, null, configs).then(
            (response) => {
              this.$notify({
                showClose: true,
                title: "问卷已成功删除",
                message: "",
                type: "success",
                duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
              });
              location.reload();
            },
            (error) => {
              this.$notify({
                showClose: true,
                title: "删除操作失败：",
                message: error.message,
                type: "error",
                duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 数据查看
    showDatas(paperId) {
      this.$router.push({
        name: "DataView",
        params: {
          paperId,
        },
      });
    },
    // 复制链接
    copyLink(url) {
      this.$copyText("http://127.0.0.1:8080/ShowQuestionnaire/" + url).then(
        (success) => {
          this.$message.success("复制成功！");
        },
        (error) => {
          this.$message.error("复制失败,请重试！");
        }
      );
    },
  },
};
</script>

<style scoped>
.item {
  width: 20%;
  height: 18em;
  margin: 3% 2.25% 0;
  border: 0.15em solid #dcdfe6;
  border-radius: 5%;
  text-align: center;
}
.number {
  font-weight: bold;
  font-size: 150%;
  /* color: #00aaff; */
}
.el-icon-menu:hover {
  color: #00aaff;
}
</style>