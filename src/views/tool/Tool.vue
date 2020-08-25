<template>
  <div>
    <Nav></Nav>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">时间戳</el-menu-item>
      <el-menu-item index="2">加密解密</el-menu-item>
      <el-menu-item v-if="isLogin" index="3">房租计算</el-menu-item>
      <el-menu-item v-if="isLogin" index="4">月流水</el-menu-item>
      <el-menu-item v-if="isLogin" index="5">密码器</el-menu-item>
      <el-menu-item v-if="isLogin" index="6">投资</el-menu-item>
    </el-menu>

    <!--时间戳-->
    <timestamp v-show="showKey ==='1'" style="margin-top: 10px;"></timestamp>

    <!--加密，解密-->
    <Encryption v-show="showKey ==='2'" style="margin-top: 10px;"></Encryption>

    <!--房租计算-->
    <Rent v-show="showKey ==='3'" style="margin-top: 10px;"></Rent>

    <!--月流水-->
    <MonthlyFunds v-if="showKey ==='4'" style="margin-top: 10px;"></MonthlyFunds>

    <!--月流水-->
    <Cipher v-if="showKey ==='5'" style="margin-top: 10px;"></Cipher>

    <!--投资-->
    <Invest v-if="showKey ==='6'" style="margin-top: 10px;"></Invest>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import { UserModule } from '@/store/modules/user'
import Encryption from '@/views/tool/component/Encryption.vue'
import Rent from '@/views/tool/component/Rent.vue'
import Timestamp from '@/views/tool/component/Timestamp.vue'
import MonthlyFunds from '@/views/tool/component/MonthlyFunds.vue'
import Cipher from '@/views/tool/component/Cipher.vue'
import Invest from '@/views/tool/component/Invest.vue'

@Component({
  name: 'Tool',
  components: {
    Cipher,
    Nav,
    Encryption,
    Rent,
    Timestamp,
    MonthlyFunds,
    Invest
  }
})
export default class extends Vue {
  private activeIndex = '1'
  private isLogin = false

  private showKey = '1'

  mounted () {
    const user = UserModule.userProfile
    if (user !== undefined) {
      this.isLogin = true
    }
  }

  private handleSelect (key: string) {
    this.showKey = key
  }
}
</script>
