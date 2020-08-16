<template>
  <div>
    <el-row :gutter="24" style="margin-top: 10px;">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <el-input v-model="totalCost" placeholder="请输入房租总金额,按Enter计算" v-on:change="calRent"></el-input>
      </el-col>
      <el-col :xs="8" :sm="8" :md="2" :lg="2" :xl="2">
        <el-button type="info" @click="clear()">Clear</el-button>
      </el-col>
    </el-row>
    <el-row v-show="moreCost!==''" :gutter="24" style="margin-top: 10px;">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        more: ¥ <span style="color: #C03639;"> {{moreCost}} </span>, less: ¥
        <span style="color: #C03639;"> {{lessCost}} </span>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Rent'
})
export default class extends Vue {
  private totalCost = ''
  private moreCost = ''
  private lessCost = ''

  private calRent () {
    const total = parseFloat(this.totalCost)
    if (total >= 200) {
      const lessCost = (total - 200) / 2
      const moreCost = lessCost + 200
      this.moreCost = moreCost.toString()
      this.lessCost = lessCost.toString()
    }
  }

  private clear () {
    this.totalCost = ''
    this.moreCost = ''
  }
}
</script>

