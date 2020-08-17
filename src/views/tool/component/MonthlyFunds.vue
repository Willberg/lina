<template>
  <div>
    <el-row>
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-date-picker v-model="selectedMonth" value-format="yyyy-MM" v-on:change="changeMonth" type="month"
                        placeholder="选择月"></el-date-picker>
      </el-col>
      <el-col :xs="16" :sm="14" :md="8" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-button type="primary" @click="addFundButton">添加</el-button>
        <el-button type="warning" @click="updateFundButton">修改</el-button>
      </el-col>
    </el-row>

    <MonthlyDisbursement v-if="!needUpdateChart && optionValue === 1"></MonthlyDisbursement>
    <MonthlyIncomeDisbursement v-if="!needUpdateChart && optionValue===2"></MonthlyIncomeDisbursement>

    <el-dialog :title="fundTitle" :visible.sync="fundsFormVisible">
      <el-form :model="fundsForm">
        <el-form-item v-show="!fundIsAdd" label="ID" label-width="120px">
          <el-input style="width: 60%;" v-model="fundsForm.id" autocomplete="off"></el-input>
          <el-button style="margin-left: 10%;" type="primary" @click="searchFunds">查询</el-button>
        </el-form-item>
        <el-form-item label="金额（元）" label-width="120px">
          <el-input v-model="fundsForm.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="120px">
          <el-select v-model="fundsForm.type" v-on:change="changeType" placeholder="请选择类型">
            <el-option v-for="t in fundTypeOptions" :label="t.label" :value="t.value" :key="t.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" label-width="120px">
          <el-select v-model="fundsForm.category" placeholder="请选择类别">
            <el-option v-for="c in fundCategoryOptions" :label="c.label" :value="c.value" :key="c.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="!fundIsAdd" label="创建时间" label-width="120px">
          {{fundsForm.createTime}}
        </el-form-item>
        <el-form-item v-show="!fundIsAdd" label="更新时间" label-width="120px">
          {{fundsForm.updateTime}}
        </el-form-item>
        <el-form-item v-show="!fundIsAdd" label="状态" label-width="120px">
          <el-select v-model="fundsForm.status" placeholder="请选择状态">
            <el-option v-for="s in fundStatusOptions" :label="s.label" :value="s.value" :key="s.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fundsFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitFund" :loading="fundLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiAddFunds, apiSearchFunds, apiUpdateFunds } from '@/api/funds'
import MonthlyDisbursement from '@/components/echarts/MonthlyDisbursement.vue'
import MonthlyIncomeDisbursement from '@/components/echarts/MonthlyIncomeDisbursement.vue'
import moment from 'moment'
import {
  fundCategoryOptions1,
  fundCategoryOptions2,
  fundsOptions,
  fundStatusOptions,
  fundTypeOptions
} from '@/constant/toolConstant'
import { IRetFunds } from '@/types/funds/types'

@Component({
  name: 'MonthlyFunds',
  components: {
    MonthlyDisbursement,
    MonthlyIncomeDisbursement
  }
})
export default class extends Vue {
  private searchLoading = false
  private fundLoading = false
  private fundsFormVisible = false
  private fundIsAdd = true
  private fundCategoryOptions = fundCategoryOptions1
  private fundTypeOptions = fundTypeOptions
  private fundStatusOptions = fundStatusOptions
  private fundTitle = ''
  private fundsForm: any = {
    id: 0,
    amount: 0,
    createTime: '',
    updateTime: '',
    category: 1,
    type: 1,
    status: 1
  }

  private options = fundsOptions
  private optionValue = 1

  private needUpdateChart = true

  private oldSelectedMonth = moment().format('YYYY-MM')
  private selectedMonth = moment().format('YYYY-MM')

  mounted () {
    localStorage.setItem('selectedMonth', this.selectedMonth)
    this.needUpdateChart = false
  }

  private changeMonth () {
    if (this.selectedMonth == null || this.selectedMonth === this.oldSelectedMonth) {
      return
    }

    this.needUpdateChart = true
    localStorage.setItem('selectedMonth', this.selectedMonth)
    const calNeedUpdateChart = this.calNeedUpdateChart

    // 让v-if生效(hacker)
    setTimeout(function () {
      calNeedUpdateChart()
    }, 100)
  }

  private calNeedUpdateChart () {
    this.oldSelectedMonth = this.selectedMonth
    this.needUpdateChart = false
  }

  private updateChart () {
    this.needUpdateChart = true
    const calNeedUpdateChart = this.calNeedUpdateChart

    // 让v-if生效(hacker)
    setTimeout(function () {
      calNeedUpdateChart()
    }, 100)
  }

  private async searchFunds () {
    this.searchLoading = true
    const param = {
      id: this.fundsForm.id
    }
    const result = await apiSearchFunds(param)
    if (result.status) {
      const data: IRetFunds = result.data
      this.fundsForm.id = data.id
      this.fundsForm.amount = data.amount
      this.fundsForm.createTime = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
      this.fundsForm.updateTime = moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')
      this.fundsForm.category = data.category
      this.fundsForm.type = data.type
      this.fundsForm.status = data.status
    }
    this.searchLoading = false
  }

  private async addFunds () {
    this.fundLoading = true
    const param = {
      amount: this.fundsForm.amount,
      category: this.fundsForm.category,
      type: this.fundsForm.type
    }
    const result = await apiAddFunds(param)
    if (result.status) {
      this.$message.success('添加成功')
      this.updateChart()
    } else {
      this.$message.error('添加失败')
    }
    this.fundsFormVisible = false
    this.fundLoading = false
  }

  private async updateFunds () {
    this.fundLoading = true
    const param = {
      id: this.fundsForm.id,
      amount: this.fundsForm.amount,
      category: this.fundsForm.category,
      type: this.fundsForm.type,
      status: this.fundsForm.status
    }
    const result = await apiUpdateFunds(param)
    if (result.status) {
      this.$message.success('更新成功')
      this.updateChart()
    } else {
      this.$message.error('更新失败')
    }
    this.fundsFormVisible = false
    this.fundLoading = false
  }

  private addFundButton () {
    this.fundTitle = '添加资金流水'
    this.fundIsAdd = true
    this.fundsFormVisible = true
  }

  private updateFundButton () {
    this.fundTitle = '更新资金流水'
    this.fundIsAdd = false
    this.fundsFormVisible = true
  }

  private changeType () {
    if (this.fundsForm.type == 1) {
      this.fundCategoryOptions = fundCategoryOptions1
    } else if (this.fundsForm.type == 2) {
      this.fundCategoryOptions = fundCategoryOptions2
    }

    this.fundsForm.category = ''
  }

  private submitFund () {
    if (this.fundIsAdd) {
      this.addFunds()
    } else {
      this.updateFunds()
    }
  }
}
</script>
