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
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2">
          <el-button style="margin-top: 10px;" type="primary" @click="now()">Now</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="20" :md="16" :lg="8" :xl="8">
          <div style="margin-top: 20px;">Unix时间戳（Unix timestamp）</div>
        </el-col>
        <el-col :xs="24" :sm="20" :md="16" :lg="8" :xl="8">
          <el-input style="margin-top: 10px;" v-model="timestamp" placeholder="请输入时间戳"></el-input>
        </el-col>
        <el-col :xs="{span:8, offset:4}" :sm="{span:6, offset:3}" :md="{span:4, offset:2}" :lg="2" :xl="2">
          <el-button style="margin-top: 10px;" type="info" v-clipboard:copy="timestamp">拷贝</el-button>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="2">
          <el-button style="margin-top: 10px;" type="primary" @click="covertTimeMillisToDatetime">转换</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :xs="24" :sm="20" :md="16" :lg="8" :xl="8">
          <div style="margin-top: 20px;">时间（年月日时分秒:2020-08-06 12:42:13）</div>
        </el-col>
        <el-col :xs="24" :sm="20" :md="16" :lg="8" :xl="8">
          <el-input style="margin-top: 10px;" v-model="datetime" placeholder="请输入时间"></el-input>
        </el-col>
        <el-col :xs="{span:8, offset:4}" :sm="{span:6, offset:3}" :md="{span:4, offset:2}" :lg="2" :xl="2">
          <el-button style="margin-top: 10px;" type="info" v-clipboard:copy="datetime">拷贝</el-button>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="2">
          <el-button style="margin-top: 10px;" type="primary" @click="covertDatetimeToTimeMillis">转换</el-button>
        </el-col>
      </el-row>
    </div>

    <!--加密，解密-->
    <div v-show="isShowEncrypt" style="margin-top: 10px;">
      <el-row :gutter="10">
        <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="2" style="margin-top: 10px;">
          加密算法：
        </el-col>
        <el-col :xs="14" :sm="12" :md="8" :lg="4" :xl="4">
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

      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11" style="margin-top: 10px;">
          <el-row :gutter="24">
            <el-col>
              <el-input type="textarea" :rows="10" v-model="pendingEncode" placeholder="请输入需要加密的内容"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col>
              <el-button type="primary" @click.native.prevent="handleEncode">加密</el-button>
              <el-button v-show="canDecode" type="info" v-clipboard:copy="pendingEncode">拷贝</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="{span: 11, offset: 2}" :xl="{span: 11, offset: 2}"
                style="margin-top: 10px;">
          <el-row :gutter="24">
            <el-col>
              <el-input type="textarea" :rows="10" v-model="pendingDecode" placeholder="请输入需要解密的内容"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col>
              <el-button v-show="canDecode" type="primary" @click.native.prevent="handleDecode">解密</el-button>
              <el-button type="info" v-clipboard:copy="pendingDecode">拷贝</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!--房租计算-->
    <div v-show="isShowRoomRent" style="margin-top: 10px;">
      <el-row :gutter="24" style="margin-top: 10px;">
        <el-col :lg="12">
          <el-input v-model="totalCost" placeholder="请输入房租总金额" v-on:change="calRent"></el-input>
        </el-col>
      </el-row>
      <el-row v-show="moreCost!==''" :gutter="24" style="margin-top: 10px;">
        <el-col :lg="12">
          more: ¥ <span style="color: #C03639;"> {{moreCost}} </span>, less: ¥ <span style="color: #C03639;"> {{lessCost}} </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import { UserModule } from '@/store/modules/user'
import moment from 'moment'
import md5 from "js-md5"
import { Base64 } from 'js-base64'

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
  private encryptAlgorithm = 'Base64'
  private pendingEncode = ''
  private pendingDecode = ''
  private options = [
    { label: 'Base64', value: 'Base64' },
    { label: 'MD5', value: 'MD5' }
  ]

  private isShowRoomRent = false
  private totalCost = ''
  private moreCost = ''
  private lessCost = ''

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

  private covertTimeMillisToDatetime () {
    if (/^[1-9][0-9]{12}$/.test(this.timestamp)) {
      this.datetime = moment(parseInt(this.timestamp)).format("YYYY-MM-DD HH:mm:ss")
    }
  }

  private covertDatetimeToTimeMillis () {
    if (/^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/.test(this.datetime)) {
      const datetimeArray: number[] = []
      for (let i of this.datetime.split('-| |:')) {
        datetimeArray.push(parseInt(i))
      }
      this.timestamp = (moment(datetimeArray).unix() * 1000).toString()
    }
  }

  private now () {
    this.timestamp = (moment().unix() * 1000).toString()
    this.datetime = moment().format("YYYY-MM-DD HH:mm:ss")
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
      this.pendingDecode = Base64.encode(this.pendingEncode)
    }
  }

  private handleDecode () {
    if (this.encryptAlgorithm === 'Base64') {
      this.pendingEncode = Base64.decode(this.pendingDecode)
    }
  }

  private calRent () {
    const total = parseFloat(this.totalCost)
    if (total >= 200) {
      const lessCost = (total - 200) / 2
      const moreCost = lessCost + 200
      this.moreCost = moreCost.toString()
      this.lessCost = lessCost.toString()
    }
  }
}
</script>
