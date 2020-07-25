<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon name="user"/>
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          name="userName"
          type="text"
          autocomplete="on"
          placeholder="请输入用户名或手机号或密码"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'"/>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px;"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>

      <el-button
        type="info"
        style="width: 100%; margin-left: 0; margin-bottom: 30px;"
        @click.native.prevent="handleRegister"
      >注册
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { isValidEmail, isValidLoginUser, isValidPhoneNumber } from '@/utils/validate'
import { UserModule } from '@/store/modules/user'
import md5 from 'js-md5'

@Component({
  name: 'Login'
})
export default class extends Vue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private validLoginUser = (rule: any, value: string, callback: Function) => {
    if (!isValidLoginUser(value)) {
      callback(new Error('请输入正确的用户名或手机号或邮箱'))
    } else {
      callback()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  }

  private loginForm = {
    userName: '',
    password: ''
  }

  private loginRules = {
    userName: [{ validator: this.validLoginUser, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }

  private passwordType = 'password'
  private loading = false

  private showPwd () {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  mounted () {
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user) {
      console.log(user)
      this.$router.push({
        path: '/'
      })
    }

    if (this.loginForm.userName === '') {
      (this.$refs.userName as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private handleLogin () {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (!valid) {
        return false
      }

      this.loading = true
      const loginParam = {
        userName: this.loginForm.userName,
        password: md5(this.loginForm.password),
        phoneNumber: isValidPhoneNumber(this.loginForm.userName) ? this.loginForm.userName : undefined,
        email: isValidEmail(this.loginForm.userName) ? this.loginForm.userName : undefined
      }

      const status = await UserModule.Login(loginParam)
      if (status) {
        await this.$router.push({
          path: '/'
        })
      } else {
        this.loading = false
      }
    })
  }

  private async handleRegister () {
    await this.$router.push({
      path: '/register'
    })
  }
}
</script>

<style lang="scss">
  // References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
  @supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
    .login-container .el-input {
      input {
        color: $loginCursorColor;
      }

      input::first-line {
        color: $lightGray;
      }
    }
  }

  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        height: 47px;
        background: transparent;
        border: 0px;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $lightGray;
        caret-color: $loginCursorColor;
        -webkit-appearance: none;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $loginBg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  .login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: $loginBg;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $darkGray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $lightGray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $darkGray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
