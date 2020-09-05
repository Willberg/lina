<template>
  <div>
    <Nav></Nav>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">时间戳</el-menu-item>
      <el-menu-item index="2">加密解密</el-menu-item>
      <el-menu-item index="3">房租计算</el-menu-item>
      <el-menu-item index="4">投资</el-menu-item>
    </el-menu>

    <!--时间戳-->
    <timestamp v-show="showKey ==='1'" style="margin-top: 10px;"></timestamp>

    <!--加密，解密-->
    <Encryption v-show="showKey ==='2'" style="margin-top: 10px;"></Encryption>

    <!--房租计算-->
    <Rent v-show="showKey ==='3'" style="margin-top: 10px;"></Rent>

    <!--投资-->
    <Invest v-show="showKey ==='4'" style="margin-top: 10px;"></Invest>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import Encryption from '@/views/tool/component/Encryption.vue'
import Rent from '@/views/tool/component/Rent.vue'
import Timestamp from '@/views/tool/component/Timestamp.vue'
import Invest from '@/views/tool/component/Invest.vue'

@Component({
  name: 'Tool',
  components: {
    Nav,
    Encryption,
    Rent,
    Timestamp,
    Invest
  }
})
export default class extends Vue {
  private activeIndex = '1'
  private showKey = '1'

  private handleSelect (key: string) {
    this.showKey = key
  }
}
</script>
