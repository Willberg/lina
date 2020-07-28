<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#30B08F" text-color="#f4f4f5">
    <el-menu-item index="1" @click.native.prevent="handleRedirectIndex">首页</el-menu-item>
    <el-menu-item index="2" style="position:absolute;right:0;" @click.native.prevent="handleLogout">退出</el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";

@Component({
  name: 'Nav'
})
export default class extends Vue {
  private async handleRedirectIndex () {
    await this.$router.push({
      path: '/'
    })
  }

  private async handleLogout () {
    const status = await UserModule.Logout()
    if (status) {
      await this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
