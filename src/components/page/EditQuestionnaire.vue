<template>
  <el-container id="createQuestionnaire">
    <!-- 添加题目 -->
    <el-aside
      style="
        padding: 0 1% 0;
        background: #ebeef5;
        border-left: 0.1em dashed #dcdfe6;
        border-right: 0.1em dashed #dcdfe6;
      "
      width="30%"
    >
      <h3 class="textCenter">添加题目</h3>
      <el-button
        style="margin: 1% 5%; width: 90%"
        round
        v-for="(item, index) in items"
        :key="index"
        @click="pushQuantionList(item)"
        >{{ item.type }}</el-button
      >
    </el-aside>

    <!-- 编辑问卷 -->
    <el-main style="margin: 0 1%; height: 46em; overflow-y: scroll">
      <h3 class="textCenter">问卷编辑</h3>
      <el-divider></el-divider>
      <h4>问卷名：</h4>
      <el-input v-model="questionnaire.name" maxlength="10"></el-input>
      <Reusable v-show="!checkName()" title="问卷名不能为空"></Reusable>
      <h4>问卷描述：</h4>
      <el-input
        type="textarea"
        :autosize="{ minRows: 3 }"
        v-model="questionnaire.description"
      >
      </el-input>
      <Reusable
        v-show="!checkDescription()"
        title="问卷描述不能为空"
      ></Reusable>
      <h4>截止时间</h4>
      <el-date-picker
        v-model="questionnaire.endTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择截止日期时间"
        :picker-options="{
          disabledDate(time) {
            return time.getTime() < new Date().getTime() - 86400000;
          },
        }"
      >
      </el-date-picker>
      <Reusable
        v-show="!checkEndtime()"
        title="当前时间不可作为截止时间"
      ></Reusable>
      <el-divider></el-divider>

      <!-- 遍历问卷 -->
      <div
        class="question-group"
        v-for="(question, indexQ) in questionnaire.questionList"
        :key="indexQ"
      >
        <div class="question">
          <!-- 复制、删除、上移、下移操作 -->
          <el-button
            class="operation-button"
            type="primary"
            size="small"
            @click="moveDown(indexQ)"
            :disabled="indexQ === questionnaire.questionList.length - 1"
          >
            下移
          </el-button>
          <el-button
            class="operation-button"
            type="primary"
            size="small"
            @click="moveUp(indexQ)"
            :disabled="indexQ === 0"
          >
            上移
          </el-button>
          <el-button
            class="operation-button"
            type="danger"
            size="small"
            @click="deleteQuestion(indexQ)"
          >
            删除
          </el-button>
          <el-button
            class="operation-button"
            type="primary"
            size="small"
            @click="copyQuestion(indexQ)"
          >
            复制
          </el-button>

          <!-- 显示题号和标题 -->
          <div class="title">
            <h3
              v-show="!question.isEditTitle"
              style="
                clear: both;
                display: inline;
                line-height: 250%;
                font-size: 150%;
                font-weight: bold;
              "
            >
              {{ indexQ + 1 }}.{{ question.title }}
            </h3>
            <el-input
              type="text"
              style="width: 30%"
              v-if="question.isEditTitle"
              v-model="input"
              ref="editTitle"
              @blur="editTitle(indexQ)"
              @keyup.enter.native="$event.target.blur()"
            >
            </el-input>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="editTitle(indexQ)"
            >
              {{ question.isEditTitle === false ? "编辑" : "完成" }}
            </el-button>
            <el-button
              v-if="
                question.type === '单选题' ||
                question.type === '多选题' ||
                question.type === '下拉选择'
              "
              type="primary"
              plain
              size="mini"
              @click="addOption(indexQ)"
            >
              增加选项
            </el-button>
          </div>

          <!-- 单选题 -->
          <div v-if="question.type === '单选题'">
            <el-radio
              v-for="(option, indexO) in question.options"
              :key="indexO"
              v-model="question.selected"
              :label="option"
              :name="indexQ + 1 + ''"
              :disabled="question.isEditOptions[indexO]"
            >
              <span v-show="!question.isEditOptions[indexO]">{{ option }}</span>
              <el-input
                type="text"
                v-if="question.isEditOptions[indexO]"
                v-model="input"
                ref="editOption"
                @blur="editOption(indexQ, indexO)"
                @keyup.enter.native="$event.target.blur()"
              >
              </el-input>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="editOption(indexQ, indexO)"
              >
                {{ !question.isEditOptions[indexO] ? "编辑" : "完成" }}
              </el-button>
              <el-button
                v-show="!question.isEditOptions[indexO]"
                type="warning"
                plain
                size="mini"
                @click="defaultRadio(option, indexQ)"
              >
                {{
                  option !== question.selected ? "设为默认选择" : "取消默认选择"
                }}
              </el-button>
              <el-button
                v-show="!question.isEditOptions[indexO]"
                type="danger"
                plain
                size="mini"
                @click="deleteOption(indexQ, indexO)"
              >
                删除
              </el-button>
            </el-radio>
          </div>

          <!-- 多选题 -->
          <div v-else-if="question.type === '多选题'">
            <el-checkbox
              v-for="(option, indexO) in question.options"
              :key="indexO"
              v-model="question.selected"
              :label="option"
              :name="indexQ + 1 + ''"
              :disabled="question.isEditOptions[indexO]"
            >
              <span v-show="!question.isEditOptions[indexO]">{{ option }}</span>
              <el-input
                type="text"
                style="width: 100%"
                v-if="question.isEditOptions[indexO]"
                v-model="input"
                ref="editOption"
                @blur="editOption(indexQ, indexO)"
                @keyup.enter.native="$event.target.blur()"
              >
              </el-input>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="editOption(indexQ, indexO)"
              >
                {{ !question.isEditOptions[indexO] ? "编辑" : "完成" }}
              </el-button>
              <el-button
                v-show="!question.isEditOptions[indexO]"
                type="warning"
                plain
                size="mini"
                @click="defaultCheckBox(option, indexQ)"
              >
                {{
                  question.selected.indexOf(option) > -1
                    ? "取消默认选择"
                    : "设为默认选择"
                }}
              </el-button>
              <el-button
                v-show="!question.isEditOptions[indexO]"
                type="danger"
                plain
                size="mini"
                @click="deleteOption(indexQ, indexO)"
              >
                删除
              </el-button>
            </el-checkbox>
          </div>

          <!-- 下拉选择 -->
          <div v-else-if="question.type === '下拉选择'">
            <el-select
              v-show="!question.isEditTips"
              style="width: 30%"
              v-model="question.selected"
              :placeholder="question.inputTips"
            >
              <el-option
                v-for="(option, indexO) in question.options"
                :key="indexO"
                :label="option"
                :value="option"
                :disabled="true"
              >
              </el-option>
            </el-select>
            <el-input
              type="text"
              style="width: 30%"
              v-if="question.isEditTips"
              v-model="input"
              ref="editTips"
              @blur="editTips(indexQ)"
              @keyup.enter.native="$event.target.blur()"
            >
            </el-input>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="editTips(indexQ)"
            >
              {{ !question.isEditTips ? "编辑提示语" : "完成" }}
            </el-button>
            <el-button
              v-show="!question.isShowEditOptions"
              type="primary"
              plain
              size="mini"
              @click="controlEditOptions(indexQ)"
            >
              编辑选项
            </el-button>
            <el-dialog
              v-show="question.isShowEditOptions"
              title="编辑选项"
              :visible.sync="question.isShowEditOptions"
              width="30%"
              center
              :show-close="false"
            >
              <div
                class="textCenter"
                style="margin: 0 0 3%"
                v-for="(option, indexO) in question.options"
                :key="indexO"
              >
                <span> 选项 {{ indexO + 1 }} ： </span>
                <el-input
                  v-model="questionnaire.questionList[indexQ].options[indexO]"
                >
                </el-input>
                <el-button
                  type="danger"
                  plain
                  size="mini"
                  @click="deleteOption(indexQ, indexO)"
                >
                  删除
                </el-button>
              </div>
              <div class="textCenter" style="margin: 5% 0 0">
                <el-button
                  v-show="question.isShowEditOptions"
                  type="primary"
                  plain
                  size="medium"
                  @click="addOption(indexQ)"
                >
                  增加选项
                </el-button>
                <el-button
                  v-show="question.isShowEditOptions"
                  type="primary"
                  plain
                  size="medium"
                  @click="
                    question.isShowEditOptions = !question.isShowEditOptions
                  "
                >
                  完成并保存
                </el-button>
              </div>
            </el-dialog>
          </div>

          <!-- 多级下拉 -->
          <div class="block" v-else-if="question.type === '多级下拉'">
            <el-cascader
              v-show="!question.isEditTips"
              v-model="question.selected"
              :options="question.options"
              :props="{ expandTrigger: 'hover' }"
              :placeholder="question.inputTips"
            >
            </el-cascader>
            <el-input
              type="text"
              style="width: 30%"
              v-if="question.isEditTips"
              v-model="input"
              ref="editTips"
              @blur="editTips(indexQ)"
              @keyup.enter.native="$event.target.blur()"
            >
            </el-input>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="editTips(indexQ)"
            >
              {{ !question.isEditTips ? "编辑提示语" : "完成" }}
            </el-button>
            <el-button
              v-show="!question.isShowEditOptions"
              type="primary"
              plain
              size="mini"
              @click="controlEditOptions(indexQ)"
            >
              编辑选项
            </el-button>
            <el-dialog
              v-show="question.isShowEditOptions"
              title="编辑选项"
              :visible.sync="question.isShowEditOptions"
              width="40%"
              center
            >
              <UpdateCascader
                :recursionOption="question.options"
                fatherName="选项"
              ></UpdateCascader>
              <div class="textCenter" style="margin: 5% 0 0">
                <el-button
                  v-show="question.isShowEditOptions"
                  type="primary"
                  plain
                  size="medium"
                  @click="addFirstLevelOption(indexQ, question.options.length)"
                >
                  增加一级选项
                </el-button>
                <el-button
                  v-show="question.isShowEditOptions"
                  type="primary"
                  plain
                  size="medium"
                  @click="
                    question.isShowEditOptions = !question.isShowEditOptions
                  "
                >
                  完成并保存
                </el-button>
              </div>
            </el-dialog>
          </div>

          <!-- 填空题 -->
          <div v-else-if="question.type === '填空题'">
            <el-input
              v-show="!question.isEditTips"
              :placeholder="question.inputTips"
              :disabled="true"
            >
            </el-input>
            <el-input
              type="text"
              style="width: 30%"
              v-if="question.isEditTips"
              v-model="input"
              ref="editTips"
              @blur="editTips(indexQ)"
              @keyup.enter.native="$event.target.blur()"
            >
            </el-input>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="editTips(indexQ)"
            >
              {{ !question.isEditTips ? "编辑提示语" : "完成" }}
            </el-button>
          </div>

          <!-- 简答题 -->
          <div v-else-if="question.type === '简答题'">
            <el-input
              style="width: 85%"
              v-show="!question.isEditTips"
              type="textarea"
              :placeholder="question.inputTips"
              :disabled="true"
              :autosize="{ minRows: 3 }"
            >
            </el-input>
            <el-input
              type="textarea"
              style="width: 60%"
              v-if="question.isEditTips"
              v-model="input"
              ref="editTips"
              :autosize="{ minRows: 3 }"
              @blur="editTips(indexQ)"
              @keyup.enter.native="$event.target.blur()"
            >
            </el-input>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="editTips(indexQ)"
            >
              {{ !question.isEditTips ? "编辑提示语" : "完成" }}
            </el-button>
          </div>
        </div>
        <!-- 下分割线 -->
        <el-divider></el-divider>
      </div>

      <!-- 操作按钮 -->
      <div class="textCenter">
        <el-button
          type="primary"
          round
          @click="submit"
          :disabled="
            questionnaire.questionList === null ||
            questionnaire.questionList.length === 0 ||
            !checkSubmit()
          "
          >提交问卷</el-button
        >
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Reusable from "../reusable/ReusableAlter.vue";
import UpdateCascader from "../reusable/UpdateCascader.vue";
// import "animate.css";
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "EditQuestionnaire",
  data() {
    return {
      // 可增加的题目(模板)
      items: [
        {
          type: "单选题",
          title: "单选题",
          isEditTitle: false,
          options: ["选项1", "选项2", "选项3"],
          isEditOptions: [false, false, false],
          selected: "",
        },
        {
          type: "多选题",
          title: "多选题",
          isEditTitle: false,
          options: ["选项1", "选项2", "选项3"],
          isEditOptions: [false, false, false],
          selected: [],
        },
        {
          type: "下拉选择",
          title: "下拉选择",
          isEditTitle: false,
          isShowEditOptions: false,
          options: ["选项1", "选项2", "选项3"],
          isEditOptions: [false, false, false],
          inputTips: "请选择",
          isEditTips: false,
          selected: "",
        },
        {
          type: "多级下拉",
          title: "多级下拉",
          isEditTitle: false,
          isShowEditOptions: false,
          options: [
            {
              value: "选项1",
              label: "选项1",
              children: [
                {
                  value: "选项1-1",
                  label: "选项1-1",
                  children: null,
                },
                {
                  value: "选项1-2",
                  label: "选项1-2",
                  children: null,
                },
              ],
            },
            {
              value: "选项2",
              label: "选项2",
              children: [
                {
                  value: "选项2-1",
                  label: "选项2-1",
                  children: null,
                },
                {
                  value: "选项2-2",
                  label: "选项2-2",
                  children: null,
                },
              ],
            },
          ],
          inputTips: "请选择",
          isEditTips: false,
          selected: "",
        },
        {
          type: "填空题",
          title: "填空题",
          isEditTitle: false,
          inputTips: "请输入内容",
          isEditTips: false,
        },
        {
          type: "简答题",
          title: "简答题",
          isEditTitle: false,
          inputTips: "请输入内容",
          isEditTips: false,
        },
      ],
      // 问卷内容
      questionnaire: {
        name: "未命名问卷",
        description:
          "非常感谢您能够参加调查，提供您的看法与意见，希望能够得到您的大力支持与合作。我们极其重视数据安全，绝不会泄露任何您的隐私信息。现在我们就马上开始吧！",
        endTime: "",
        questionList: [],
      },
      // 编辑框内容
      input: "",
    };
  },
  components: { UpdateCascader, Reusable },
  methods: {
    // 获取当前时间
    nowTime() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        hours: nowDate.getHours(),
        minutes: nowDate.getMinutes(),
        seconds: nowDate.getSeconds(),
      };

      let newmonth = date.month > 10 ? date.month : "0" + date.month;
      let newday = date.date > 10 ? date.date : "0" + date.date;
      let newminutes = date.minutes > 10 ? date.minutes : "0" + date.minutes;
      let newseconds = date.seconds > 10 ? date.seconds : "0" + date.seconds;
      //   const newminutes = date.minutes < 10 ? "0" + date.minutes : date.minutes;
      //   const newseconds = date.seconds < 10 ? "0" + date.seconds : date.seconds;

      return (
        date.year +
        "-" +
        newmonth +
        "-" +
        newday +
        " " +
        date.hours +
        ":" +
        newminutes +
        ":" +
        newseconds
      );
    },
    // 添加题目
    pushQuantionList(item) {
      // 相当于new一个新的item对象，避免覆盖模板
      let newItem = JSON.parse(JSON.stringify(item));
      // 将newItem放入题目集
      this.questionnaire.questionList.push(newItem);
      this.$set(
        this.questionnaire.questionList[
          this.questionnaire.questionList.length - 1
        ],
        "id",
        this.newId()
      );
    },
    // 复制题目
    copyQuestion(index) {
      let copyIndex = JSON.parse(
        JSON.stringify(this.questionnaire.questionList[index])
      );
      this.questionnaire.questionList.splice(index, 0, copyIndex);
    },
    // 删除题目
    deleteQuestion(index) {
      this.questionnaire.questionList.splice(index, 1);
    },
    // 题目上移
    moveUp(index) {
      if (index !== 0) {
        // 当前索引前一位的数据
        let itemPrevious = this.questionnaire.questionList[index - 1];
        // 当前索引的数据
        let itemIndex = this.questionnaire.questionList[index];
        //
        this.$set(this.questionnaire.questionList, index - 1, itemIndex);
        this.$set(this.questionnaire.questionList, index, itemPrevious);
      }
    },
    // 题目下移
    moveDown(index) {
      if (index !== this.questionnaire.questionList.length - 1) {
        // 当前索引的数据
        let itemIndex = this.questionnaire.questionList[index];
        // 当前索引后一位的数据
        let itemLast = this.questionnaire.questionList[index + 1];
        //
        this.$set(this.questionnaire.questionList, index, itemLast);
        this.$set(this.questionnaire.questionList, index + 1, itemIndex);
      }
    },
    // 编辑标题
    editTitle(index) {
      // 修改编辑状态
      this.questionnaire.questionList[index].isEditTitle =
        !this.questionnaire.questionList[index].isEditTitle;
      // 未编辑状态转为编辑状态
      if (this.questionnaire.questionList[index].isEditTitle) {
        // 自动获取焦点
        this.$nextTick(function () {
          this.$refs.editTitle[0].focus();
        });
        this.input = this.questionnaire.questionList[index].title;
      }
      // 编辑状态转为未编辑状态
      else {
        // 编辑内容不为空，修改为新赋的值
        if (this.input.trim().length !== 0) {
          this.questionnaire.questionList[index].title = this.input;
        }
        // 重置input的值
        this.input = "";
      }
    },
    // 编辑选项内容(单选多选修改单项)
    editOption(indexQ, indexO) {
      // 修改编辑状态
      this.$set(
        this.questionnaire.questionList[indexQ].isEditOptions,
        indexO,
        !this.questionnaire.questionList[indexQ].isEditOptions[indexO]
      );
      // 未编辑状态转为编辑状态
      if (this.questionnaire.questionList[indexQ].isEditOptions[indexO]) {
        // 自动获取焦点
        this.$nextTick(function () {
          this.$refs.editOption[0].focus();
        });
        this.input = this.questionnaire.questionList[indexQ].options[indexO];
      }
      // 编辑状态转为未编辑状态
      else {
        // 编辑内容不为空，修改为新赋的值
        if (this.input.trim().length !== 0) {
          // 若原来的值已勾选，则去除
          for (
            let i = 0;
            i < this.questionnaire.questionList[indexQ].selected.length;
            i++
          ) {
            if (
              this.questionnaire.questionList[indexQ].selected[i] ===
              this.questionnaire.questionList[indexQ].options[indexO]
            ) {
              this.questionnaire.questionList[indexQ].selected.splice(i, 1);
              break;
            }
          }
          // 赋新值
          this.questionnaire.questionList[indexQ].options[indexO] = this.input;
        }
        // 重置input的值
        this.input = "";
      }
    },
    // 控制修改选项内容(下拉框)弹窗的显示与隐藏
    controlEditOptions(indexQ) {
      // 修改编辑状态
      this.questionnaire.questionList[indexQ].isShowEditOptions =
        !this.questionnaire.questionList[indexQ].isShowEditOptions;
    },
    // 编辑提示信息
    editTips(index) {
      // 修改编辑状态
      this.questionnaire.questionList[index].isEditTips =
        !this.questionnaire.questionList[index].isEditTips;
      // 未编辑状态转为编辑状态
      if (this.questionnaire.questionList[index].isEditTips) {
        // 自动获取焦点
        this.$nextTick(function () {
          this.$refs.editTips[0].focus();
        });
        this.input = this.questionnaire.questionList[index].inputTips;
      }
      // 编辑状态转为未编辑状态
      else {
        // 编辑内容不为空，修改为新赋的值
        if (this.input.trim().length !== 0) {
          this.questionnaire.questionList[index].inputTips = this.input;
        }
        // 重置input的值
        this.input = "";
      }
    },
    // 增加选项
    addOption(index) {
      let newLength = this.questionnaire.questionList[index].options.length + 1;
      this.questionnaire.questionList[index].options.push("选项" + newLength);
      this.questionnaire.questionList[index].isEditOptions.push(false);
    },
    addFirstLevelOption(indexQ, indexO) {
      let newPush = {
        value: "选项" + (indexO + 1),
        label: "选项" + (indexO + 1),
        children: null,
      };
      this.questionnaire.questionList[indexQ].options.push(newPush);
    },
    // 删除选项
    deleteOption(indexQ, indexO) {
      this.questionnaire.questionList[indexQ].options.splice(indexO, 1);
      this.questionnaire.questionList[indexQ].isEditOptions.splice(indexO, 1);
    },
    // 设置默认选项(单选题)
    defaultRadio(option, index) {
      // 设为默认选择
      if (option !== this.questionnaire.questionList[index].selected) {
        this.questionnaire.questionList[index].selected = option;
      }
      // 取消默认选择
      else {
        this.questionnaire.questionList[index].selected = "";
      }
    },
    // 设置默认选项(多选题)
    defaultCheckBox(option, indexQ) {
      // 原本为默认，取消勾选
      if (
        this.questionnaire.questionList[indexQ].selected.indexOf(option) > -1
      ) {
        this.questionnaire.questionList[indexQ].selected.splice(
          this.questionnaire.questionList[indexQ].selected.indexOf(option),
          1
        );
      }
      // 原本非默认，设为默认
      else {
        let newOption = option + "";
        this.questionnaire.questionList[indexQ].selected.push(newOption);
      }
    },
    // 随机id
    newId() {
      return Math.floor(
        (Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 9)
      );
    },
    // 提交判断合法性
    checkName() {
      let result = null;
      if (
        this.questionnaire.name === null ||
        this.questionnaire.name.length === 0
      ) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    checkDescription() {
      let result = null;
      if (
        this.questionnaire.description === null ||
        this.questionnaire.description.length === 0
      ) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    checkEndtime() {
      let result = null;
      if (
        this.questionnaire.endTime === null ||
        this.questionnaire.endTime.length === 0 ||
        new Date(this.questionnaire.endTime).getTime() < new Date().getTime()
      ) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    checkSubmit() {
      let result = null;
      if (this.checkName() && this.checkDescription() && this.checkEndtime()) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
    // 提交，创建问卷
    submit() {
      if (this.checkSubmit()) {
        // 配置请求参数：
        // 1.请求路径
        let url =
          this.$route.name === "UpdateQuestionnaire"
            ? "http://127.0.0.1:8084/tybar/paper/updatepaper"
            : "http://127.0.0.1:8084/tybar/paper/addpaper";
        // 2.传给后端的数据
        let questionnaireForm = new FormData();
        let paperId =
          this.$route.name === "UpdateQuestionnaire"
            ? this.$route.params.paperId
            : this.newId();
        questionnaireForm.append(
          "userId",
          JSON.parse(Cookies.get("userInfo")).id
        );
        questionnaireForm.append("paperId", paperId);
        questionnaireForm.append("paperTitle", this.questionnaire.name);
        questionnaireForm.append(
          "paperSummary",
          this.questionnaire.description
        );
        questionnaireForm.append("paperEndDate", this.questionnaire.endTime);
        questionnaireForm.append("paperStatus", 0);
        questionnaireForm.append(
          "questionList",
          JSON.stringify(this.questionnaire.questionList)
        );
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
            if (response.data) {
              this.$message({
                showClose: true,
                message:
                  "提交问卷成功！！！   填写链接：http://127.0.0.1:8080/showQuestionnaire/" +
                  paperId,
                type: "success",
                duration: 10000, //显示时间, 毫秒。设为 0 则不会自动关闭
              });
              this.$router.replace({
                name: "UserIndex",
              });
            }
          },
          (error) => {
            this.$message({
              showClose: true,
              message: "创建问卷失败：" + error.message,
              type: "error",
              duration: 5000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
          }
        );
      }
    },
  },
  created() {
    if (this.$route.name === "UpdateQuestionnaire") {
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
          this.questionnaire.name = response.data.data.paperTitle;
          this.questionnaire.description = response.data.data.paperSummary;
          this.questionnaire.endTime = response.data.data.paperEndDate;
          this.questionnaire.questionList = JSON.parse(
            response.data.data.questionList
          );
        },
        (error) => {
          this.$notify({
            showClose: true,
            title: "资源获取失败了~",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
          this.$router.push({
            name: "UserIndex",
          });
        }
      );
    }
  },
  mounted() {
    this.questionnaire.endTime = this.nowTime();
  },
};
</script>

<style scoped>
#createQuestionnaire {
  margin: 0% 10%;
}
/* 水平居中 */
.textCenter {
  text-align: center;
}
.textCenter .el-button {
  margin: 0 2% 0;
}
/* 题目操作项右浮动 */
.operation-button {
  float: right;
}
/* 每一组题目的样式 */
.question-group {
  margin: 0%;
}
/* 指针悬浮某题目时的背景颜色 */
.question-group:hover {
  background: #e4e7ed;
}
.question-group:hover .question {
  margin: -3% 3% 0%;
  padding: 3% 0% 0%;
}
/*  */
.question {
  margin: 0% 3%;
}
/*  */
.el-button {
  margin: 0 1% 0;
}
/*  */
.title .el-button {
  display: none;
  margin: 0% 1%;
}
.title:hover .el-button {
  display: inline;
}
/* 输入框长度 */
.el-input {
  width: 40%;
}
/* 使得每个选择题选项独立一行 */
.el-radio,
.el-checkbox {
  display: block;
  line-height: 250%;
}
/* 悬浮时字体加粗 */
.el-radio:hover,
.el-checkbox:hover {
  font-weight: bolder;
}
/* 操作按钮隐藏 */
.el-radio .el-button,
.question-group .operation-button,
.el-checkbox .el-button {
  display: none;
}
/* 悬浮时，操作按钮显示 */
.el-radio:hover .el-button,
.question-group:hover .operation-button,
.el-checkbox:hover .el-button {
  display: inline;
  margin: 0 0 0 1%;
}
/* 覆盖上者部分样式 */
.el-checkbox:hover .el-button {
  margin: 0 0 0 3%;
}
</style>