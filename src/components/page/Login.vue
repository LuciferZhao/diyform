<template>
  <div class="login-register-container">
    <!-- 左侧logo -->
    <div class="left">
      <img
        src="./../../assets/login.png"
        style="width: 100%; margin-top: 18%"
      />
    </div>

    <!-- 右侧功能 -->
    <div class="right">
      <h2>Welcome to <span id="headline">Tybar!</span></h2>
      <el-tabs class="tab" v-model="activeName" :stretch="true">
        <!-- 登录标签页 -->
        <el-tab-pane label="登录" name="login">
          <el-form
            class="login-register-form"
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
          >
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                @keyup.enter.native="submitCheck('loginForm')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                show-password
                @keyup.enter.native="submitCheck('loginForm')"
              >
              </el-input>
            </el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              @click="submitCheck('loginForm')"
            >
              登录
            </el-button>
          </el-form>
        </el-tab-pane>

        <!-- 注册标签页 -->
        <el-tab-pane label="邮箱注册" name="register">
          <el-form
            class="login-register-form"
            ref="registerForm"
            :model="registerForm"
            :rules="registerRules"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                @keyup.enter.native="submitCheck('registerForm')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                placeholder="请输入密码"
                show-password
                @keyup.enter.native="submitCheck('registerForm')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input
                v-model="registerForm.checkPassword"
                placeholder="请输入再次输入密码"
                show-password
                @keyup.enter.native="submitCheck('registerForm')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                type="email"
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                @keyup.enter.native="submitCheck('registerForm')"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="registerForm.code"
                style="width: 60%; float: left"
                placeholder="请输入验证码"
                @keyup.enter.native="submitCheck('registerForm')"
              >
              </el-input>
              <el-button
                type="primary"
                style="margin-left: 10%"
                @click="getCode"
                :disabled="registerForm.disabledCode"
              >
                {{ registerForm.buttonShow }}
              </el-button>
            </el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              @click="submitCheck('registerForm')"
            >
              注册
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "Login",
  data() {
    return {
      // 路由守卫：跳转前路径
      beforeRouteEnterName: null,
      beforeRouteEnterPath: null,
      // 标签页选中项
      activeName: "login",
      // 登录信息
      loginForm: {
        email: "",
        password: "",
      },
      // 注册信息
      registerForm: {
        username: "",
        email: "",
        password: "",
        checkPassword: "",
        code: "",
        checkCode: null,
        buttonShow: "邮箱不合法",
        disabledCode: true,
        time: 60,
        timer: null,
      },
      // 登陆验证
      loginRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          {
            type: "email",
            message: "请输入有效的邮箱地址",
            trigger: ["blur"],
          },
          {
            min: 6,
            max: 30,
            message: "长度在 6 到 30 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            type: "string",
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
        ],
      },
      // 注册验证
      registerRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              for (let i = 0; i < value.length; i++) {
                if (value[i] === " ") {
                  callback(new Error("用户名不能含有空格字符"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            type: "string",
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            type: "string",
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              if (this.registerForm.password !== value) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: ["blur"],
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "change" },
          {
            validator: (rules, value, callback) => {
              let verifyEmailType =
                /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
              if (!verifyEmailType.test(value)) {
                callback(new Error("请输入有效的邮箱地址"));
                callback(() => {
                  (this.registerForm.disabledCode = true),
                    (this.registerForm.buttonShow = "邮箱不合法");
                });
              } else if (value.length < 6 || value.length > 30) {
                callback(new Error("长度在 6 到 30 个字符"));
                callback(() => {
                  (this.registerForm.disabledCode = true),
                    (this.registerForm.buttonShow = "邮箱不合法");
                });
              }
              // 判断邮箱是否可注册
              else {
                axios
                  .get("http://127.0.0.1:8084/tybar/user/isRegist/" + value)
                  .then(
                    (response) => {
                      // 邮箱可注册
                      if (response.data.message === "true") {
                        (this.registerForm.disabledCode = false),
                          (this.registerForm.buttonShow = "发送验证码");
                        callback();
                      }
                      // 邮箱已被注册
                      else if (response.data.message === "false") {
                        callback(new Error("该邮箱已被注册"));
                        (this.registerForm.disabledCode = true),
                          (this.registerForm.buttonShow = "邮箱已被注册");
                      } else {
                        callback();
                      }
                    },
                    (error) => {
                      // 回显错误信息
                      this.$notify({
                        showClose: true,
                        title: "邮箱验证失败，请稍后再试：",
                        message: error.message,
                        type: "error",
                        duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
                      });
                      callback();
                    }
                  );
              }
            },
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "change" },
          {
            validator: (rules, value, callback) => {
              if (value !== this.registerForm.checkCode) {
                callback(new Error("验证码不正确"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      this.registerForm.timer = window.setInterval(() => {
        (this.registerForm.disabledCode = true),
          (this.registerForm.buttonShow =
            "倒计时" + this.registerForm.time + "秒");
        --this.registerForm.time;
        if (this.registerForm.time < 0) {
          (this.registerForm.disabledCode = false),
            (this.registerForm.buttonShow = "重新发送");
          this.registerForm.time = 60;
          window.clearInterval(this.registerForm.timer);
        }
      }, 1000);
      axios
        .get(
          "http://127.0.0.1:8084/tybar/user/code?receiver=" +
            this.registerForm.email
        )
        .then(
          (response) => {
            this.registerForm.checkCode = response.data.data;
          },
          (error) => {
            // 回显错误信息
            this.$notify({
              showClose: true,
              title: "验证码获取失败，请稍后再试：",
              message: error.message,
              type: "error",
              duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
          }
        );
      // }
    },
    // 提交验证
    submitCheck(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === "loginForm") {
            this.login(false, this.loginForm.email, this.loginForm.password);
          }
          if (formName === "registerForm") {
            this.register();
          }
        }
      });
    },
    // 登录
    login(autoLogin, email, password) {
      let userForm = new FormData();
      userForm.append("email", email);
      userForm.append("password", password);
      axios.post("http://127.0.0.1:8084/tybar/user/login", userForm).then(
        (response) => {
          if (response.data.data === null) {
            alert("邮箱或密码错误，请重新输入~");
          } else {
            // 保存cookie到浏览器
            Cookies.set("userInfo", JSON.stringify(response.data.data), {
              expires: 1,
            });
            // 登录回显
            if (
              autoLogin &&
              this.beforeRouteEnterName === "ShowQuestionnaire"
            ) {
              // 填写链接时注册
              alert(
                "Hello," +
                  this.registerForm.username +
                  " ! " +
                  "您已注册成功，本次访问将为你自动登录，并为你跳转至问卷链接 ！"
              );
            } else if (autoLogin) {
              // 普通注册
              alert(
                "Hello," +
                  this.registerForm.username +
                  " ! " +
                  "您已注册成功，本次访问将为你自动登录 ！"
              );
            } else if (this.beforeRouteEnterName === "ShowQuestionnaire") {
              // 填写链接时登录
              alert(
                "登录成功，欢迎回来~" +
                  response.data.data.username +
                  " ! " +
                  "即将为你跳转至问卷链接。"
              );
            } else {
              // 普通登录
              alert("登录成功，欢迎回来~" + response.data.data.username);
            }
            // 跳转
            this.$router.replace({
              path:
                this.beforeRouteEnterName === "ShowQuestionnaire"
                  ? this.beforeRouteEnterPath
                  : "/",
            });
          }
        },
        (error) => {
          if (autoLogin) {
            // 回显错误信息
            this.$notify({
              showClose: true,
              title: "恭喜注册成功，系统尝试自动登录失败",
              message: "请手动登录或稍后再试：" + error.message,
              type: "error",
              duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
          } else {
            // 回显错误信息
            this.$notify({
              showClose: true,
              title: "登陆失败，请稍后再试：",
              message: error.message,
              type: "error",
              duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
            });
          }
        }
      );
    },
    // 注册
    register() {
      let userForm = new FormData();
      userForm.append("username", this.registerForm.username);
      userForm.append("password", this.registerForm.password);
      userForm.append("email", this.registerForm.email);
      userForm.append("usercode", this.registerForm.code);
      axios.post("http://127.0.0.1:8084/tybar/user/regist", userForm).then(
        (response) => {
          // 注册成功后自动登录
          this.login(true, this.registerForm.email, this.registerForm.password);
        },
        (error) => {
          // 回显错误信息
          this.$notify({
            showClose: true,
            title: "注册失败，请稍后再试：",
            message: error.message,
            type: "error",
            duration: 3000, //显示时间, 毫秒。设为 0 则不会自动关闭
          });
        }
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.beforeRouteEnterName = from.name;
      vm.beforeRouteEnterPath = from.path;
    });
  },
};
</script>

<style scoped>
.login-register-container {
  width: 100%;
}
.left {
  padding: auto;
  width: 50%;
  float: left;
}
.right {
  padding: auto;
  width: 50%;
  float: right;
  margin-top: 3%;
}
.tab {
  width: 56%;
  margin: auto;
}
.login-register-form {
  position: relative;
  width: 95%;
  margin: 0;
  background: #fff;
  padding: 3%;
}
h2 {
  text-align: center;
}
#headline {
  font-size: 150%;
  color: #409eff;
}
</style>

