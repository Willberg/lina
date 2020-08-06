<template>
  <div>
    <Nav></Nav>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">时间戳</el-menu-item>
      <el-menu-item index="2">加密解密</el-menu-item>
      <el-menu-item v-if="isLogin" index="3">房租计算</el-menu-item>
    </el-menu>


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import { UserModule } from "@/store/modules/user";

@Component({
  name: 'Tool',
  components: {
    Nav
  }
})
export default class extends Vue {
  private activeIndex = '1'
  private isLogin = false

  mounted () {
    const user = UserModule.userProfile
    if (user === undefined) {
      this.isLogin = true
    }
  }

  private handleSelect (key: string) {

  }
}
</script>
