<template>
  <div v-if="isLogin">
    <el-row :gutter="10" style="margin-top: 50px;">
      <el-col style="margin-top: 10px;" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>计时器类别：</b>
      </el-col>
      <el-col :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-select v-show="isShowTypeSelect" v-model="timerSelectType"
                   placeholder="请选择计时器类别">
          <el-option v-for="t in timerTypes" :label="t.label" :value="t.value" :key="t.value"></el-option>
        </el-select>
        <el-tag style="margin-top: 5px;" v-if="!isShowTypeSelect">{{calTimerType(timerLastOne.type)}}</el-tag>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 10px;">
      <el-col style="margin-top: 10px;" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>计时开关：</b>
      </el-col>
      <el-col v-show="timerIsEdit" style="margin-top: 10px;" :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-switch style="margin-left: 20px;" v-model="timerLastOne.status===1" disabled active-color="#13ce66"
                   inactive-color="#ff4949"></el-switch>
      </el-col>
      <el-col v-show="!timerIsEdit" style="margin-top: 10px;" :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-switch style="margin-left: 20px;" v-model="timerLastOne.status===1" disabled active-color="#13ce66"
                   inactive-color="#ff4949"></el-switch>
      </el-col>
    </el-row>

    <el-row v-show="timerIsEdit" :gutter="10" style="margin-top: 20px;">
      <el-col :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>开始时间：</b>
      </el-col>
      <el-col :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-input v-model="updateTimerCreateTime" placeholder="请输入修改的开始时间"></el-input>
      </el-col>
    </el-row>
    <el-row v-show="!timerIsEdit && timerStatus" :gutter="10" style="margin-top: 20px;">
      <el-col :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>本阶段用时：</b>
      </el-col>
      <el-col :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <b style="color: #C03639">{{timerUseTime}} s</b>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 10px;">
      <el-col style="margin-top: 10px;" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>是否编辑：</b>
      </el-col>
      <el-col style="margin-top: 10px;" :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-switch style="margin-left: 20px;" v-model="timerIsEdit" v-on:change="calShowTypeSelect"
                   active-color="#13ce66"
                   inactive-color="#ff4949"></el-switch>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px;">
      <el-col style="margin-top: 10px;" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <b>操作：</b>
      </el-col>
      <el-col :xs="16" :sm="16" :md="10" :lg="10" :xl="10">
        <el-button type="primary" :loading="confirmLoading" round size="medium" @click="confirmTimer">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { timerTypes } from '@/constant/timerConstant'
import { IAddTimer, IRetTimer, IUpdateTimer } from '@/types/timer/types'
import { apiAddTimer, apiSearchTimerLastOne, apiUpdateTimer } from '@/api/timer'
import moment from 'moment'

@Component({
  name: 'Timer'
})
export default class extends Vue {
  private countdownTimer: any | undefined

  private isLogin = false
  private timerStatus = false
  private timerTypes = timerTypes
  private timerUseTime = 0
  private timerIsEdit = false
  private isShowTypeSelect = false
  private timerSelectType = 1
  private timerLastOne: IRetTimer | undefined
  private confirmLoading = false
  private addTimer: IAddTimer = {
    type: 1
  }
  private updateTimerCreateTime: string = ''
  private updateTimer: IUpdateTimer = {
    id: 0
  }

  mounted () {
    if (UserModule.userProfile !== undefined) {
      this.initTimer()
    }

    const updateTimerUseTime = this.updateTimerUseTime
    this.countdownTimer = setInterval(function () {
      updateTimerUseTime()
    }, 1000)
  }

  beforeDestroy () {
    // 清除定时刷新，不清除会一直运行，关闭页面也会定时刷新
    if (this.countdownTimer !== undefined) {
      clearInterval(this.countdownTimer);
    }
  }

  private async initTimer () {
    const result = await apiSearchTimerLastOne()
    if (result.status) {
      this.isLogin = true
      this.timerLastOne = result.data
      this.calTimerLastOne()
      if (this.timerLastOne?.status == 1) {
        this.timerStatus = true
        this.timerUseTime = moment().unix() - parseInt((this.timerLastOne.createTime / 1000).toString())
      }
    }
  }

  private updateTimerUseTime () {
    if (this.timerStatus) {
      this.timerUseTime++
    }
  }

  private calShowTypeSelect () {
    if (this.timerLastOne === undefined) {
      this.isShowTypeSelect = true
    } else {
      if (this.timerIsEdit) {
        this.isShowTypeSelect = true
      } else {
        this.isShowTypeSelect = this.timerLastOne.status == 2;
      }
    }
  }

  private calTimerType (type: number) {
    for (let t of this.timerTypes) {
      if (t.value === type) {
        this.timerSelectType = t.value
        return t.label
      }
    }
    return ''
  }

  private calTimerLastOne () {
    this.calShowTypeSelect()
    if (this.timerLastOne !== undefined) {
      if (this.timerLastOne.status == 1) {
        this.addTimer.relatedId = this.timerLastOne.id
        this.addTimer.type = this.timerLastOne.type
      } else {
        this.addTimer.relatedId = undefined
      }

      this.updateTimer.id = this.timerLastOne.id
      this.updateTimer.createTime = this.timerLastOne.updateTime
      this.updateTimer.type = this.timerLastOne.type
      this.updateTimerCreateTime = moment(this.timerLastOne.createTime).format('YYYY-MM-DD HH:mm:ss')
    } else {
      this.updateTimer.type = 1
    }
  }

  private async confirmTimer () {
    this.confirmLoading = true
    if (this.timerIsEdit) {
      this.updateTimer.type = this.timerSelectType
      this.updateTimer.createTime = moment(this.updateTimerCreateTime, 'YYYY-MM-DD HH:mm:ss').unix() * 1000
      let oldStatus: number = 1
      if (this.timerLastOne !== undefined) {
        oldStatus = this.timerLastOne.status
      }
      const result = await apiUpdateTimer(this.updateTimer)
      if (result.status) {
        this.$message.success('更新计时器成功')
        this.timerLastOne = result.data
        if (this.timerLastOne !== undefined) {
          this.timerLastOne.status = oldStatus
        }
        this.calTimerLastOne()
        if (this.timerLastOne?.status == 1) {
          this.timerStatus = true
          this.timerUseTime = moment().unix() - parseInt((this.timerLastOne.createTime / 1000).toString())
        }
      }
    } else {
      this.addTimer.type = this.timerSelectType
      const result = await apiAddTimer(this.addTimer)
      if (result.status) {
        this.$message.success('添加计时器成功')
        this.timerLastOne = result.data
        this.calTimerLastOne()
        if (this.timerLastOne?.status == 1) {
          this.timerStatus = true
          this.timerUseTime = moment().unix() - parseInt((this.timerLastOne.createTime / 1000).toString())
        } else {
          this.timerStatus = false
        }
      }
    }
    this.confirmLoading = false
  }
}
</script>
