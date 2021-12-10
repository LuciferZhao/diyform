<template>
  <div id="showQuestionnaire">
    <!-- 用户信息 -->
    <el-button
      type="primary"
      size="small"
      style="float: right; margin: 1% 2%"
      v-show="originalData === undefined"
      @click="switchUser"
    >
      切换账号
    </el-button>
    <p style="padding: 0 0 0 5%">
      正在以
      <span style="font-weight: bold">{{ username }}</span>
      身份{{ originalData === undefined ? "填写" : "修改" }}
    </p>
    <el-divider></el-divider>

    <!-- 问卷表头 -->
    <h3 class="textCenter">问卷填写</h3>
    <el-divider></el-divider>

    <!-- 标题、问卷描述 -->
    <div class="question-group">
      <h4>{{ questionnaire.paperTitle }}</h4>
      <span>{{ questionnaire.paperSummary }}</span>
    </div>
    <el-divider></el-divider>

    <!-- 遍历并渲染问卷 -->
    <div v-for="(question, indexQ) in questionnaire.questionList" :key="indexQ">
      <!-- 各项问卷内容 -->
      <div class="question-group">
        <!-- 显示题号和标题 -->
        <h3 style="line-height: 200%; font-size: 150%; font-weight: bold">
          {{ indexQ + 1 }}.{{ question.title }}
        </h3>

        <!-- 单选题 -->
        <div v-if="question.type === '单选题'">
          <el-radio
            v-for="(option, indexO) in question.options"
            :key="indexO"
            v-model="selected[indexQ][idList[indexQ]]"
            :label="option"
            :name="indexQ + 1 + ''"
          >
          </el-radio>
        </div>

        <!-- 多选题 -->
        <div v-else-if="question.type === '多选题'">
          <el-checkbox
            v-for="(option, indexO) in question.options"
            :key="indexO"
            v-model="selected[indexQ][idList[indexQ]]"
            :label="option"
            :name="indexQ + 1 + ''"
          >
          </el-checkbox>
        </div>

        <!-- 下拉选择 -->
        <div v-else-if="question.type === '下拉选择'">
          <el-select
            style="width: 30%"
            v-model="selected[indexQ][idList[indexQ]]"
            :placeholder="question.inputTips"
          >
            <el-option
              v-for="(option, indexO) in question.options"
              :key="indexO"
              :label="option"
              :value="option"
            >
            </el-option>
          </el-select>
        </div>

        <!-- 多级下拉 -->
        <div class="block" v-else-if="question.type === '多级下拉'">
          <el-cascader
            v-model="selected[indexQ][idList[indexQ]]"
            :options="question.options"
            :placeholder="question.inputTips"
          >
          </el-cascader>
        </div>

        <!-- 填空题 -->
        <div v-else-if="question.type === '填空题'">
          <el-input
            style="width: 85%"
            v-model="selected[indexQ][idList[indexQ]]"
            :placeholder="question.inputTips"
          >
          </el-input>
        </div>

        <!-- 简答题 -->
        <div v-else-if="question.type === '简答题'">
          <el-input
            style="width: 85%"
            v-model="selected[indexQ][idList[indexQ]]"
            type="textarea"
            :placeholder="question.inputTips"
            :autosize="{ minRows: 3 }"
          >
          </el-input>
        </div>

        <!-- 未填写弹窗 -->
        <ReusableAlter
          style="margin: 3% 0"
          v-show="checkList[indexQ]"
          title="问卷此项仍未填写"
        ></ReusableAlter>
      </div>

      <!-- 下分割线 -->
      <el-divider></el-divider>
    </div>

    <!-- 操作按钮 -->
    <div class="textCenter">
      <el-button type="primary" round @click="submit">
        {{ originalData !== undefined ? "提交问卷" : "保存修改" }}
      </el-button>
      <el-button
        v-show="originalData !== undefined"
        type="danger"
        round
        @click="deleteData()"
      >
        删除数据
      </el-button>
    </div>

    <!-- 问卷未发布弹窗 -->
    <el-dialog
      title="提示"
      v-if="originalData === undefined"
      :visible.sync="showCenterDialog.publish"
      width="30%"
      center
      fullscreen
      :show-close="false"
    >
      <div class="textCenter">
        <span>该问卷还未发布，请稍后再来~</span>
      </div>
      <div class="textCenter" style="margin: 2% 0">
        <el-button type="primary" round @click="replace('UserIndex')">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 问卷已截止弹窗 -->
    <el-dialog
      v-if="originalData === undefined"
      title="提示"
      :visible.sync="showCenterDialog.ending"
      width="30%"
      center
      fullscreen
      :show-close="false"
    >
      <div class="textCenter">
        <span>该问卷已截止，下次早点来吧~</span>
      </div>
      <div class="textCenter" style="margin: 2% 0">
        <el-button type="primary" round @click="replace('UserIndex')">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 填写未登录弹窗 -->
    <el-dialog
      v-if="originalData === undefined"
      title="提示"
      :visible.sync="showCenterDialog.login"
      width="30%"
      center
      fullscreen
      :show-close="false"
    >
      <div class="textCenter">
        <span>为了更好的收集数据，请先登录再来填写吧~</span>
      </div>
      <div class="textCenter" style="margin: 2% 0">
        <el-button type="primary" round @click="replace('Login')">
          立即前往
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ReusableAlter from "./../reusable/ReusableAlter.vue";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "ShowQuestionnaire",
  data() {
    return {
      username: "",
      questionnaire: {},
      selected: [],
      idList: [],
      checkList: [],
      showCenterDialog: {
        publish: false,
        login: false,
        ending: false,
      },
    };
  },
  components: { ReusableAlter },
  props: ["originalData"],
  methods: {
    // 切换账号
    switchUser() {
      Cookies.remove("userInfo");
      this.$router.replace({
        name: "Login",
      });
    },
    // 判断输入合法性
    check() {
      let result = true;
      if (this.checkList.length !== 0) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i] === true) {
            result = false;
            break;
          }
        }
      }
      return result;
    },
    // 提交问卷
    submit() {
      // 新增selected监视属性
      this.$watch("selected", {
        immediate: true, //初始化时让handler调用一下
        deep: true,
        handler() {
          for (let i = 0; i < this.selected.length; i++) {
            let id = this.idList[i];
            if (
              this.selected[i][id] === null ||
              this.selected[i][id] === undefined ||
              this.selected[i][id].length === 0
            ) {
              this.$set(this.checkList, i, true);
            } else {
              this.$set(this.checkList, i, false);
            }
          }
        },
      });

      // 若输入合法则提交请求
      if (this.check()) {
        // 多选题数组顺序重排
        // this.sortCheckbox();
        // 配置请求参数：
        // 1.请求路径
        let url =
          this.originalData !== undefined && this.originalData !== null
            ? /*修改*/ "http://127.0.0.1:8084/tybar/qstanswer/updateAnswer"
            : /*新增*/ "http://127.0.0.1:8084/tybar/qstanswer/addAnswer";
        // 2.传给后端的数据
        let questionnaireForm = new FormData();
        // 修改
        if (this.originalData !== undefined && this.originalData !== null) {
          questionnaireForm.append("answerId", this.originalData.answerId);
          questionnaireForm.append("selected", JSON.stringify(this.selected));
        }
        // 新增
        else {
          questionnaireForm.append(
            "userId",
            JSON.parse(Cookies.get("userInfo")).id
          );
          questionnaireForm.append("paperId", this.questionnaire.paperId);
          questionnaireForm.append("selected", JSON.stringify(this.selected));
        }
        // 3.其他配置
        let configs = {
          headers: {
            "Content-Type":
              "application/json;multipart/form-data;charset=UTF-8",
          },
        };
        // 发送请求
        axios.post(url, questionnaireForm, configs).then(
          (response) => {
            this.$notify({
              showClose: true,
              title:
                (this.originalData !== undefined && this.originalData !== null
                  ? "修改"
                  : "提交") + "问卷成功！！！",
              message: "",
              type: "success",
              duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
            if (this.originalData !== undefined && this.originalData !== null) {
              location.reload();
            } else {
              this.$router.replace({
                name: "UserIndex",
              });
            }
          },
          (error) => {
            this.$notify({
              showClose: true,
              title:
                (this.originalData !== undefined && this.originalData !== null
                  ? "修改"
                  : "提交") + "问卷失败",
              message: error.message,
              type: "error",
              duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
          }
        );
      }
    },
    // 删除数据
    deleteData() {
      this.$bus.$emit("deleteData");
    },
    // 跳转至
    replace(name) {
      this.$router.replace({
        name,
      });
      this.$bus.$emit("urlFilter");
    },
  },
  created() {
    // 配置请求参数：
    // 1.传给后端的数据
    let paperId = this.$route.params.paperId;
    // 2.请求路径
    let url = "http://127.0.0.1:8084/tybar/paper/onepaper/" + paperId;
    // 3.其他配置
    let configs = {
      headers: {
        "Content-Type": "application/json;multipart/form-data;charset=UTF-8",
      },
    };
    // 发送请求
    axios.get(url, null, configs).then(
      (response) => {
        // 管理员修改
        if (this.originalData !== undefined && this.originalData !== null) {
          this.username = JSON.parse(Cookies.get("userInfo")).username;
          this.questionnaire = response.data.data;
          this.questionnaire.questionList = JSON.parse(
            this.questionnaire.questionList
          );
          for (let i = 0; i < this.questionnaire.questionList.length; i++) {
            let add = {};
            this.$set(
              add,
              this.questionnaire.questionList[i].id,
              this.originalData[i]
            );
            this.selected.push(JSON.parse(JSON.stringify(add)));
            this.idList.push(this.questionnaire.questionList[i].id);
          }
          this.questionnaire.userId = null;
          for (let i = 0; i < this.selected.length; i++) {
            this.checkList.push(false);
          }
        }
        // 用户访问
        else {
          if (response.data.message === "unstart") {
            this.showCenterDialog.publish = true;
          } else if (response.data.message === "ending") {
            this.showCenterDialog.ending = true;
          } else if (Cookies.get("userInfo") === undefined) {
            this.showCenterDialog.login = true;
          } else {
            this.username = JSON.parse(Cookies.get("userInfo")).username;
            this.questionnaire = response.data.data;
            this.questionnaire.questionList = JSON.parse(
              this.questionnaire.questionList
            );
            this.questionnaire.questionList.forEach((q) => {
              let add = {};
              this.$set(
                add,
                q.id,
                q.selected === null || q.selected === undefined
                  ? ""
                  : q.selected
              );
              this.selected.push(JSON.parse(JSON.stringify(add)));
              this.idList.push(q.id);
            });
            this.questionnaire.userId = null;
            for (let i = 0; i < this.selected.length; i++) {
              this.checkList.push(false);
            }
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
  },
};
</script>

<style scoped>
#showQuestionnaire {
  width: 60%;
  margin: 0 auto;
  padding: 1% 0;
  background-color: #f2f6fc;
}
/* 水平居中 */
.textCenter {
  text-align: center;
}
.textCenter .el-button {
  margin: 0 2% 0;
}
/* 问卷项布局位置 */
.question-group {
  margin: 3% 5%;
}
/* 使得每个选择题选项独立一行 */
.el-radio,
.el-checkbox {
  display: block;
  line-height: 250%;
}
</style>