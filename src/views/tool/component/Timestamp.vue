<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="16" :sm="16" :md="4" :lg="4" :xl="4">
        <el-button style="margin-top: 10px;" type="primary" @click="now()">Now</el-button>
        <el-button style="margin-top: 10px;" type="info" @click="clear()">Clear</el-button>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component({
  name: 'Timestamp'
})
export default class extends Vue {
  private timestamp = ''
  private datetime = ''

  private covertTimeMillisToDatetime () {
    if (/^[1-9][0-9]{12}$/.test(this.timestamp)) {
      this.datetime = moment(parseInt(this.timestamp)).format("YYYY-MM-DD HH:mm:ss")
    }
  }

  private covertDatetimeToTimeMillis () {
    if (/^[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/.test(this.datetime)) {
      this.timestamp = (moment(this.datetime, 'YYYY-MM-DD HH:mm:ss').unix() * 1000).toString()
    }
  }

  private now () {
    this.timestamp = (moment().unix() * 1000).toString()
    this.datetime = moment().format("YYYY-MM-DD HH:mm:ss")
  }

  private clear () {
    this.timestamp = ''
    this.datetime = ''
  }
}
</script>
