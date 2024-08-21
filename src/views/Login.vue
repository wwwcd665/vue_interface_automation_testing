<template>
  <div class="temp">
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {ElMessage} from 'element-plus';

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const resp = await this.$api.login(this.loginForm)
          if (resp.data.code == 200) {
            const token = resp.data.token
            window.sessionStorage.setItem('token', token)
            window.sessionStorage.setItem('username', this.loginForm.username)
            console.log('登录成功')
            ElMessage({
              message: '登录成功',
              type: 'success',
            })
            this.$router.push('/projects')
          } else if (resp.data.code == 401) {
            ElMessage({
              message: '账号密码错误',
              type: 'warning',
            })
          } else {
            ElMessage({
              message: '登录失败',
              type: 'error',
            })
          }

        } else {
          console.log('验证失败');
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style scoped>
.temp {
  /* 你可以在这里添加背景图片 */
  background-image: url('../assets/bj.png'); /* 替换为你的图片 URL */
  background-size: cover; /* 覆盖整个元素 */
  background-position: center; /* 背景居中 */
  height: 98vh; /* 高度设置为视口高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  text-align: left;
  min-height: 100vh;
}

.login-container {
  width: 300px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加一些阴影效果 */
  border-radius: 5px; /* 圆角效果 */
  background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  margin-left: 15%;
}

.el-input__inner {
  text-align: left; /* 使输入框内文本左对齐 */
}
</style>
