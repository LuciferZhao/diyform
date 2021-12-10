<template>
  <div>
    <!-- 数据表格 -->
    <el-table
      ref="showDatasTable"
      :data="tableData"
      style="width: 100%"
      stripe
      :height="tableHeight"
      border
      header-align="center"
      @row-click="rowClick"
      @selection-change="changeSelected"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" align="center" width="50%">
      </el-table-column>
      <!-- 序号 -->
      <el-table-column type="index" align="center" width="50%" label="序号">
      </el-table-column>
      <!-- 各项数据 -->
      <el-table-column
        v-for="(column, index) in tableTitle"
        :key="index"
        :prop="index + ''"
        :label="column"
        align="center"
        sortable
      >
      </el-table-column>
    </el-table>

    <!-- 按钮组 -->
    <el-button-group style="margin: 1.5% 0 3%; float: right">
      <el-button type="primary" @click="selectAll">全部选中</el-button>
      <el-button type="primary" @click="clearSelected">取消选中</el-button>
      <el-button type="primary" @click="clearSort">清除排序</el-button>
      <el-button type="primary" @click="copyData">复制</el-button>
      <el-button
        type="primary"
        @click="updateData(selected[0])"
        :disabled="selected.length !== 1"
      >
        修改
      </el-button>
      <el-button type="danger" @click="deleteData">删除</el-button>
      <el-button type="primary" @click="outputData($route.params.paperId)"
        >导出数据</el-button
      >
      <el-button
        type="danger"
        @click="clearData"
        :disabled="tableData.length === 0"
      >
        清空数据
      </el-button>
      <el-button
        type="danger"
        @click="deleteQuestionnaire($route.params.paperId)"
      >
        删除问卷
      </el-button>
    </el-button-group>

    <!-- 弹窗 -->
    <el-dialog
      title="更新数据"
      :visible.sync="showCenterDialog.updateData"
      width="80%"
      center
    >
      <ShowQuestionnaire
        style="height: 32.5em; width: 80%; overflow-y: scroll"
        :originalData="originalData"
      >
      </ShowQuestionnaire>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import ShowQuestionnaire from "./ShowQuestionnaire.vue";

export default {
  name: "ShowDatas",
  components: {
    ShowQuestionnaire,
  },
  data() {
    return {
      tableTitle: [] /*["日期", "姓名", "地址"]*/,
      tableData: [],
      selected: [],
      originalData: {},
      showCenterDialog: {
        updateData: false,
      },
    };
  },
  computed: {
    tableHeight() {
      let height = this.tableData.length >= 10 ? "38.6em" : null;
      return height;
    },
  },
  methods: {
    // 点击单行，反向选择
    rowClick(row) {
      this.$refs.showDatasTable.toggleRowSelection(row);
    },
    // 勾选项更变
    changeSelected(row) {
      this.selected = row;
    },
    // 全部选中
    selectAll() {
      this.clearSelected();
      this.$refs.showDatasTable.toggleAllSelection();
    },
    // 取消选中
    clearSelected() {
      this.$refs.showDatasTable.clearSelection();
      this.selected = [];
    },
    // 清除排序
    clearSort() {
      this.$refs.showDatasTable.clearSort();
    },
    // 复制已勾选
    copyData() {
      // 返回id的数组
      let answerIdList = [];
      this.selected.forEach((d) => {
        answerIdList.push(d.answerId);
      });

      // 配置请求参数：
      // 1.请求路径
      let url = "http://127.0.0.1:8084/tybar/qstanswer/copyAnswer";
      // 2.传给后端的数据
      let params = new FormData();
      params.append("answerIdList", JSON.stringify(answerIdList));
      // 3.其他配置
      let configs = {
        headers: {
          "Content-Type": "application/json;multipart/form-data;charset=UTF-8",
        },
      };

      // 发送请求
      axios.post(url, params, configs).then(
        (response) => {
          // 成功回显
          this.$message({
            type: "success",
            message: "复制成功!",
          });
          location.reload();
        },
        (error) => {
          this.$notify({
            showClose: true,
            title: "复制失败：",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
        }
      );
    },
    // 修改已勾选
    updateData(originalData) {
      this.showCenterDialog.updateData = true;
      this.originalData = originalData;
    },
    // 删除已勾选
    deleteData() {
      this.$confirm("数据删除后将无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
        roundButton: true,
      })
        .then(() => {
          // 返回id的数组
          let answerIdList = [];
          this.selected.forEach((d) => {
            answerIdList.push(d.answerId);
          });
          // 配置请求参数：
          // 1.请求路径
          let url = "http://127.0.0.1:8084/tybar/qstanswer/delAnswer";
          // 2.传给后端的数据
          let params = new FormData();
          params.append("answerIdList", JSON.stringify(answerIdList));
          // 3.其他配置
          let configs = {
            headers: {
              "Content-Type":
                "application/json;multipart/form-data;charset=UTF-8",
            },
          };

          // 发送请求
          axios.post(url, params, configs).then(
            (response) => {
              // 成功回显
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              location.reload();
            },
            (error) => {
              this.$notify({
                showClose: true,
                title: "删除失败：",
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
    // 导出数据
    outputData(paperId) {
      window.location.href =
        "http://127.0.0.1:8084/tybar/qstanswer/downExcel/" + paperId;
    },
    // 清空数据
    clearData() {
      this.selectAll();
      this.deleteData();
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
              this.$router.push({
                name: "UserIndex",
              });
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
  },
  created() {
    // 获取该问卷信息
    {
      // 配置请求参数：
      // 1.传给后端的数据
      let paperId = this.$route.params.paperId;
      // 2.请求路径
      let url = "http://127.0.0.1:8084/tybar/paper/paperStatement/" + paperId;
      // 3.其他配置
      let configs = {
        headers: {
          "Content-Type": "application/json;multipart/form-data;charset=UTF-8",
        },
      };
      // 发送请求
      axios.get(url, null, configs).then(
        (response) => {
          this.tableTitle = response.data.data.qstTitles;
          // 遍历每一条问卷数据
          for (let i = 0; i < response.data.data.qstAnswer.length; i++) {
            this.tableData.push({
              answerId: response.data.data.qstAnswer[i].answerId,
              userId: response.data.data.qstAnswer[i].userId,
            });
            // 遍历每一个用户填写的单条数据(每一个选项)
            for (
              let j = 0;
              j < JSON.parse(response.data.data.qstAnswer[i].answer).length;
              j++
            ) {
              Object.keys(
                JSON.parse(response.data.data.qstAnswer[i].answer)[j]
              ).forEach((key) => {
                let result;
                // 数组：逐一添加
                if (
                  typeof JSON.parse(response.data.data.qstAnswer[i].answer)[j][
                    key
                  ] === "object"
                ) {
                  result = [];
                  for (
                    let o = 0;
                    o <
                    JSON.parse(response.data.data.qstAnswer[i].answer)[j][key]
                      .length;
                    o++
                  ) {
                    result.push(
                      JSON.parse(response.data.data.qstAnswer[i].answer)[j][
                        key
                      ][o]
                    );
                  }
                }
                // 字符串：直接获取
                else {
                  result = JSON.parse(response.data.data.qstAnswer[i].answer)[
                    j
                  ][key];
                }
                this.$set(this.tableData[i], j, result);
              });
            }
          }
        },
        (error) => {
          this.$notify({
            showClose: true,
            title: "资源获取失败了~",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
        }
      );
    }
  },
  mounted() {
    this.$bus.$on("deleteData", this.deleteData);
  },
  beforeDestroy() {
    this.$bus.$off("deleteData");
  },
};
</script>

<style>
</style>