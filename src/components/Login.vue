<template>
  <div class="container">
    <div class="login-box">
      <!-- 登录头像区 -->
      <div class="headerimg">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单账号密码 -->
      <el-form
        :model="form"
        :rules="rules"
        label-width="0px"
        class="login_form"
        ref="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="renew">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        username: "admin",
        password: "123456",
      },
      // input验证规则
      rules: {
        username: [
          { required: true, message: "请输入账户名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置表单
    renew() {
      this.$refs.loginForm.resetFields();
      // 点击登录预校验
    },
    login() {
      this.$refs.loginForm.validate(async (vaild) => {
        if (!vaild) return;
        // const res = await this.$http({
        //   methods: "post",
        //   url: "/login",
        //   data: this.form,
        // });
        // console.log(res);
        const { data: res } = await this.$http.post("/login", this.form);
        if (res.meta.status !== 200) return this.$message.error("登錄失敗");
        this.$message.success("登陸成功");
        // 1.将登陆成功后的 token 保存到客户端的sessionStorage 中
        //  1.1 项目中除了登录之外的其他API接口，必须在登陆之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将 token保存在sessionStorage
        // console.log(res);
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%c;
  background: linear-gradient(#c0a5f3, #7f95f7);
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 300px;
  background-color: #5fd894;
  border-radius: 5px;
  transform: translate(-50%, -50%);
}
.headerimg {
  position: absolute;
  left: 50%;
  width: 90px;
  height: 90px;
  border: 1px;
  padding: 10px;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 7px #ddd;
  }
}
.login_form {
  padding: 0 30px;
  margin-top: 100px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>>

