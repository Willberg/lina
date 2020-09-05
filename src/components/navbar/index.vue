<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#000000"
             background-color="#30B08F" text-color="#f4f4f5" @select="handleSelect">
      <el-menu-item index="1" @click.native.prevent="handleRedirect('/')">首页</el-menu-item>
      <el-menu-item index="2" @click.native.prevent="handleRedirect('/todoGroupList')">待办</el-menu-item>
      <el-menu-item index="3" @click.native.prevent="handleRedirect('/funds')">记账</el-menu-item>
      <el-menu-item index="4" @click.native.prevent="handleRedirect('/cipher')">密码器</el-menu-item>
      <el-menu-item index="11" @click.native.prevent="handleRedirect('/tool')">常用工具</el-menu-item>
      <el-menu-item v-if="!isLogin" index="12" style="position:absolute;right:0;"
                    @click.native.prevent="handleRedirect('/login')">登陆
      </el-menu-item>
      <!--      <el-menu-item v-if="isLogin" index="12" style="position:absolute;right:0;" @click.native.prevent="handleLogout">-->
      <!--        退出-->
      <!--      </el-menu-item>-->
      <el-submenu v-if="isLogin" index="12" style="position:absolute;right:0;">
        <template slot="title">个人中心</template>
        <el-menu-item index="12-1" @click.native.prevent="editPasswordVisible=true">修改密码</el-menu-item>
        <el-menu-item index="12-2" @click.native.prevent="handleLogout">退出</el-menu-item>
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
import { UserModule } from '@/store/modules/user'
import { NAV_INDEX } from '@/constant/storageConstant'
import { getUser, updatePassword } from '@/api/user'
import md5 from 'js-md5'
import { isValidPassword } from "@/utils/validate";

@Component({
  name: 'Nav'
})
export default class extends Vue {
  private isLogin = UserModule.userProfile !== undefined
  private activeIndex = '1'

  private editPasswordVisible = false
  private editLoading = false
  private updatePassword = {
    oldPassword: '',
    newPassword: ''
  }

  created () {
    this.activeIndex = localStorage.getItem(NAV_INDEX) || '1'
  }

  mounted () {
    const user = UserModule.userProfile
    if (user === undefined) {
      if (location.hash === '#/') {
        // 首页时进行用户资料查询
        this.getUserAndSetUser()
      }
    }
  }

  private async getUserAndSetUser () {
    const result = await getUser()
    if (result.status) {
      this.isLogin = true
      UserModule.setUser(result.data)
    }
  }

  private async handleRedirect (page: string) {
    if (this.descPage(page) !== this.activeIndex) {
      await this.$router.push({
        path: page
      })
    }
  }

  private descPage (page: string) {
    if (page === '/') {
      return '1'
    } else if (page === '/todoGroupList') {
      return '2'
    } else if (page === '/tool') {
      return '11'
    } else {
      return '12'
    }
  }

  private handleSelect (key: string) {
    if (!key.startsWith('12')) {
      localStorage.setItem(NAV_INDEX, key)
    }
  }

  private async handleLogout () {
    const status = await UserModule.Logout()
    if (status) {
      this.isLogin = false
      if (location.hash !== '#/') {
        await this.$router.push({
          path: '/'
        })
      }
    }
    if (location.hash === '#/') {
      // 首页退出，刷新首页，隐藏要登录的功能
      location.reload()
    }
  }

  private async submitUpdatePassword () {
    if (this.updatePassword.oldPassword === ''
      || this.updatePassword.newPassword === ''
      || this.updatePassword.oldPassword === this.updatePassword.newPassword) {
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
