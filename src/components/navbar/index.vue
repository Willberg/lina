<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#000000"
             background-color="#30B08F" text-color="#f4f4f5" @select="handleSelect">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="11">作息</el-menu-item>
      <el-menu-item index="21">待办</el-menu-item>
      <el-menu-item index="22">题库</el-menu-item>
      <el-menu-item index="31">记账</el-menu-item>
      <el-menu-item index="41">密码器</el-menu-item>
      <el-menu-item index="51">常用工具</el-menu-item>
      <el-menu-item v-if="!isLogin" index="91" :style="position">登陆</el-menu-item>
      <el-submenu v-if="isLogin" index="92" :style="position">
        <template slot="title">个人中心</template>
        <el-menu-item index="92-1" @click.native.prevent="editPasswordVisible=true">修改密码</el-menu-item>
        <el-menu-item index="92-2" @click.native.prevent="handleLogout">退出</el-menu-item>
      </el-submenu>
    </el-menu>

    <!-- Form -->
    <el-dialog title="修改密码" :visible.sync="editPasswordVisible">
      <el-form :model="updatePassword">
        <el-form-item label="原密码" label-width="140px">
          <el-input v-model="updatePassword.oldPassword" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="140px">
          <el-input v-model="updatePassword.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPasswordVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpdatePassword" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { logout, updatePassword } from '@/api/user'
import md5 from 'js-md5'
import { isValidPassword } from '@/utils/validate'
import { navKeyUrlMap, navUrlKeyMap } from '@/constant/navbarConstant'
import { USER } from '@/constant/storageConstant'

@Component({
  name: 'Nav'
})
export default class extends Vue {
  private isLogin = localStorage.getItem(USER) !== null
  private activeIndex = '1'

  private position = 'position:absolute;right:0;'

  private editPasswordVisible = false
  private editLoading = false
  private updatePassword = {
    oldPassword: '',
    newPassword: ''
  }

  mounted () {
    this.activeIndex = this.descPage(location.hash.substring(1))
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Android') >= 0 || userAgent.indexOf('iPhone') >= 0) {
      this.position = ''
    }
  }

  private descPage (page: string) {
    return navUrlKeyMap[page]
  }

  private async handleSelect (key: string) {
    if (key.startsWith('92')) {
      return
    }
    if (location.hash === '#/todoList' || key !== this.activeIndex) {
      const page = navKeyUrlMap[key]
      await this.$router.push({
        path: page
      })
    }
  }

  private async handleLogout () {
    const result = await logout()
    if (result.status) {
      this.isLogin = false
      localStorage.clear()
      if (location.hash !== '#/') {
        await this.$router.push({
          path: '/'
        })
      }
    }
  }

  private async submitUpdatePassword () {
    if (this.updatePassword.oldPassword === '' ||
      this.updatePassword.newPassword === '' ||
      this.updatePassword.oldPassword === this.updatePassword.newPassword) {
      this.$message.error('请完善信息')
      return
    }

    if (!isValidPassword(this.updatePassword.newPassword)) {
      this.$message.error('请填写正确的密码，必须包含6位以上，并且含大写字母，小写字母，数字，特殊符号中的三种及以上')
      return
    }

    this.editLoading = true
    const param = {
      oldPassword: md5(this.updatePassword.oldPassword),
      newPassword: md5(this.updatePassword.newPassword)
    }
    const result = await updatePassword(param)
    if (result.status) {
      this.$message.success('修改成功')
    }
    this.updatePassword = {
      oldPassword: '',
      newPassword: ''
    }
    this.editLoading = false
    this.editPasswordVisible = false
  }
}
</script>
