<template>
  <div>
    <Nav></Nav>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">时间戳</el-menu-item>
      <el-menu-item index="2">加密解密</el-menu-item>
      <el-menu-item v-if="isLogin" index="3">房租计算</el-menu-item>
    </el-menu>

    <!--时间戳-->
    <div v-show="isShowTimeMillis" style="margin-top: 10px;">
      <el-row :gutter="24">
        <el-col :lg="8">
          <div style="margin-top: 10px;">Unix时间戳（Unix timestamp）</div>
        </el-col>
        <el-col :lg="6">
          <el-input v-model="timestamp" placeholder="请输入时间戳" v-on:change="covertTimeMillisToDatetime"></el-input>
        </el-col>
        <el-col :lg="2">
          <el-button type="primary" v-clipboard:copy="timestamp">拷贝</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 10px;">
        <el-col :lg="8">
          <div style="margin-top: 10px;">时间（年月日时分秒:2020-08-06 12:42:13）</div>
        </el-col>
        <el-col :lg="6">
          <el-input v-model="datetime" placeholder="请输入时间" v-on:change="covertDatetimeToTimeMillis"></el-input>
        </el-col>
        <el-col :lg="2">
          <el-button type="primary" v-clipboard:copy="datetime">拷贝</el-button>
        </el-col>
      </el-row>
    </div>

    <!--加密，解密-->
    <div v-show="isShowEncrypt" style="margin-top: 10px;">
      <el-row :gutter="24">
        <el-col :lg="2" style="margin-top: 10px;">
          加密算法：
        </el-col>
        <el-col :lg="4">
          <el-select v-model="encryptAlgorithm" placeholder="请选择" @change="handleSelectAlgorithm">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 10px;">
        <el-col :lg="11">
          <el-input type="textarea" :rows="10" v-model="pendingEncode" placeholder="请输入需要加密的内容"></el-input>
        </el-col>
        <el-col :lg="11" :offset="2">
          <el-input type="textarea" :rows="10" v-model="pendingDecode" placeholder="请输入需要解密的内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 10px;">
        <el-col :lg="12">
          <el-button type="primary" @click.native.prevent="handleEncode">加密</el-button>
          <el-button v-show="canDecode" type="info" v-clipboard:copy="pendingEncode">拷贝</el-button>
        </el-col>
        <el-col :lg="12">
          <el-button v-show="canDecode" type="primary" @click.native.prevent="handleDecode">解密</el-button>
          <el-button type="info" v-clipboard:copy="pendingDecode">拷贝</el-button>
        </el-col>
      </el-row>
    </div>

    <!--房租计算-->
    <div v-show="isShowRoomRent" style="margin-top: 10px;">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import { UserModule } from '@/store/modules/user'
import moment from 'moment'
import md5 from "js-md5";

@Component({
  name: 'Tool',
  components: {
    Nav
  }
})
export default class extends Vue {
  private activeIndex = '1'
  private isLogin = false

  private isShowTimeMillis = true
  private timestamp = ''
  private datetime = ''

  private isShowEncrypt = false
  private canDecode = true
  private encryptAlgorithm = ''
  private pendingEncode = ''
  private pendingDecode = ''
  private options = [
    { label: 'Base64', value: 'Base64' },
    { label: 'MD5', value: 'MD5' }
  ]

  private isShowRoomRent = false

  mounted () {
    const user = UserModule.userProfile
    if (user !== undefined) {
      this.isLogin = true
    }
  }

  private handleSelect (key: string) {
    if (key === '1') {
      this.isShowTimeMillis = true
      this.isShowEncrypt = false
      this.isShowRoomRent = false
    } else if (key === '2') {
      this.isShowTimeMillis = false
      this.isShowEncrypt = true
      this.isShowRoomRent = false
    } else {
      this.isShowTimeMillis = false
      this.isShowEncrypt = false
      this.isShowRoomRent = true
    }
  }

  private handleSelectAlgorithm (algorithm: string) {
    if (algorithm === 'MD5') {
      this.canDecode = false
    } else {
      this.canDecode = true
    }
  }

  private handleEncode () {
    if (this.encryptAlgorithm === 'MD5') {
      this.pendingDecode = md5(this.pendingEncode)
    } else {
    }
  }

  private handleDecode () {
    if (this.encryptAlgorithm !== 'MD5') {
    }
  }

  private covertTimeMillisToDatetime (timeMillis: string) {
    if (/^[1-9][0-9]{12}$/.test(timeMillis)) {
      this.datetime = moment(parseInt(timeMillis)).format("YYYY-MM-DD HH:mm:ss")
    }
  }

  private covertDatetimeToTimeMillis (datetime: string) {
    if (/^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/.test(datetime)) {
      const datetimeArray: number[] = []
      for (let i of datetime.split('-| |:')) {
        datetimeArray.push(parseInt(i))
      }
      this.timestamp = (moment(datetimeArray).unix() * 1000).toString()
    }
  }
}
</script>
