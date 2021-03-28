<template>
  <div class="login-page">
    <div class="login-left">
      <img src="../assets/logo-text.png" />
    </div>
    <a-form :form="form" class="login-form" @submit="handleSubmit">
      <a-form-item>
        <h1>一网统管管理系统</h1>
      </a-form-item>
      <a-form-item>
        <a-input
          :maxLength="50"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入用户名' }],
            },
          ]"
          placeholder="请输入用户名"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          :maxLength="50"
          v-decorator="[
            'password',
            {
              rules: [{ required: true, message: '请输入密码' }],
            },
          ]"
          type="password"
          placeholder="请输入密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button">
          立即登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { setUserInfo } from "@/util";
import fetchApi from "@/api/index";

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, params) => {
        if (!err) {
          fetchApi({
            method: "POST",
            apiPath: `/tsysuser/login`,
            params,
          }).then((res) => {
            setUserInfo({ ...res?.data, isAdmin: res?.data?.admin });
            this.$message.success("登录成功");
            this.$router.replace("/");
          });
        }
      });
    },
  },
};
</script>
<style scope>
.login-page {
  display: flex;
  justify-content: space-between;
}
.login-left {
  position: relative;
  flex: 1;
  background: url(../assets/bg.png) no-repeat;
  background-size: cover;
}
.login-left img {
  position: absolute;
  left: 20px;
  top: 20px;
}
.login-form.ant-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  height: 100vh;
  padding: 0 100px 50px;
}
.login-form-button {
  width: 100%;
}
</style>
