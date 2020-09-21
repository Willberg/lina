<template>
  <div>
    <Nav></Nav>
    <el-row style="margin-top: 10px;">
      <el-col :xs="8" :sm="8" :md="8" :lg="4" :xl="4">
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="4" :xl="4">
        <el-date-picker v-model="selectedMonth" value-format="yyyy-MM" v-on:change="changeMonth" type="month"
                        placeholder="选择月"></el-date-picker>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="4" :xl="4">
        <el-button type="primary" @click="addFundButton">添加</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;" :gutter="10">
      <el-col :xs="16" :sm="14" :md="12" :lg="8" :xl="8">
        <el-date-picker
          v-model="dateTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-col>
      <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="6">
        <el-button type="primary" @click="searchFunds">查询</el-button>
        <el-button type="primary" @click="isShowFundsList=false">显示图表</el-button>
      </el-col>
    </el-row>

    <MonthlyDisbursement v-if="!isShowFundsList && !needUpdateChart && optionValue === 1">
    </MonthlyDisbursement>
    <MonthlyIncomeDisbursement style="margin-top: 10px;" v-if="!isShowFundsList && !needUpdateChart && optionValue===2">
    </MonthlyIncomeDisbursement>

    <el-table
      v-if="isShowFundsList"
      v-loading="listLoading"
      :data="fundsList"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%; margin-top: 10px;">
      <el-table-column
        sortable
        fixed="left"
        align="center"
        prop="id"
        width="60"
        label="ID">
      </el-table-column>
      <el-table-column
        sortable
        width="160"
        fixed="left"
        align="center"
        prop="createTime"
        label="创建日期">
        <template slot-scope="scope">
          {{descTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="amount"
        width="100"
        label="金额">
      </el-table-column>
      <el-table-column
        align="center"
        prop="memo"
        label="备注">
        <template slot-scope="scope">
          <div style="text-align:left; white-space: pre-line;">{{ scope.row.memo }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        width="160"
        label="更新时间">
        <template slot-scope="scope">
          {{descTime(scope.row.updateTime)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="category"
        width="100"
        :filters="filterCategoryArray"
        :filter-method="filterHandler"
        label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type===2?'success': 'danger'">
            {{descCategory(scope.row.category)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        width="80"
        :filters="filterTypeArray"
        :filter-method="filterHandler"
        label="类别">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type===2?'success': 'danger'">
            {{descType(scope.row.type)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="updateFundButton(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="fundTitle" :visible.sync="fundsFormVisible">
      <el-form :model="fundsForm">
        <el-form-item v-show="!fundIsAdd" label="ID" label-width="120px">
          {{fundsForm.id}}
        </el-form-item>
        <el-form-item label="金额（元）" label-width="120px">
          <el-input v-model="fundsForm.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" rows="5" v-model="fundsForm.memo" autocomplete="off"></el-input>
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
        <el-form-item label="创建时间" label-width="120px">
          <span v-show="fundIsAdd && createTimeDisable">{{fundsForm.createTime}}</span>
          <el-date-picker v-show="!fundIsAdd || !createTimeDisable"
                          style="width: 60%;"
                          v-model="fundsForm.createTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期时间">
          </el-date-picker>
          <el-button v-show="fundIsAdd" style="margin-left: 5%;" type="primary" @click="changeCreateTime">
            {{changeCreateTimeVal}}
          </el-button>
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
import { apiAddFunds, apiSearchFundsList, apiUpdateFunds } from '@/api/funds'
import MonthlyDisbursement from '@/components/echarts/MonthlyDisbursement.vue'
import MonthlyIncomeDisbursement from '@/components/echarts/MonthlyIncomeDisbursement.vue'
import moment from 'moment'
import {
  filterCategoryArray,
  filterTypeArray,
  fundCategoryOptions1,
  fundCategoryOptions2,
  fundsOptions,
  fundStatusOptions,
  fundTypeOptions
} from '@/constant/toolConstant'
import { IRetFunds } from '@/types/funds/types'
import Nav from '@/components/navbar/index.vue'
import { startDateTimeStr, thisStartWeekDay } from '@/utils/time'

@Component({
  name: 'Funds',
  components: {
    MonthlyDisbursement,
    MonthlyIncomeDisbursement,
    Nav
  }
})
export default class extends Vue {
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
    memo: '',
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: '',
    category: 1,
    type: 1,
    status: 1
  }

  private listLoading = false
  private isShowFundsList = false
  private oldFund: IRetFunds | undefined
  private fundsList: IRetFunds[] = []
  private createTimeDisable = true
  private changeCreateTimeVal = '编辑'
  private dateTimeRange: string[] | null = []
  private filterCategoryArray = filterCategoryArray
  private filterTypeArray = filterTypeArray

  private options = fundsOptions
  private optionValue = 1

  private needUpdateChart = true

  private oldSelectedMonth = moment().format('YYYY-MM')
  private selectedMonth = moment().format('YYYY-MM')

  mounted () {
    localStorage.setItem('selectedMonth', this.selectedMonth)
    this.needUpdateChart = false

    this.dateTimeRange = [
      thisStartWeekDay(),
      startDateTimeStr(moment().add(1, 'days'))
    ]
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
    if (this.dateTimeRange == null ||
      this.dateTimeRange.length < 2) {
      this.$message.error('请选择时间范围')
      return
    }

    this.listLoading = true
    this.isShowFundsList = true
    const startTime = moment(this.dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss').unix() * 1000
    const endTime = moment(this.dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss').unix() * 1000
    const param = {
      startTime: startTime,
      endTime: endTime
    }
    this.fundsList = []
    const result = await apiSearchFundsList(param)
    if (result.status) {
      const dataList: IRetFunds[] = result.data
      for (const data of dataList) {
        this.fundsList.push(data)
      }
    }
    this.listLoading = false
  }

  private async addFunds () {
    if (this.fundsForm.amount <= 0) {
      this.$message.error('金额要大于0')
      return
    }

    if (this.fundsForm.memo === '') {
      this.$message.error('请填写备注')
      return
    }

    this.fundLoading = true
    const param = {
      amount: this.fundsForm.amount,
      memo: this.fundsForm.memo,
      createTime: !this.createTimeDisable ? moment(this.fundsForm.createTime, 'YYYY-MM-DD HH:mm:ss').unix() * 1000 : undefined,
      category: this.fundsForm.category,
      type: this.fundsForm.type
    }
    const result = await apiAddFunds(param)
    if (result.status) {
      this.$message.success('添加成功')
      this.fundsList.push(result.data)
      if (!this.isShowFundsList) {
        this.updateChart()
      }
    }
    this.fundsFormVisible = false
    this.fundLoading = false
  }

  private async updateFunds () {
    this.fundLoading = true
    const createTime = moment(this.fundsForm.createTime, 'YYYY-MM-DD HH:mm:ss').unix() * 1000
    const memo = this.oldFund?.memo !== this.fundsForm.memo ? this.fundsForm.memo : undefined
    const param = {
      id: this.fundsForm.id,
      amount: this.fundsForm.amount,
      memo: memo,
      category: this.fundsForm.category,
      createTime: this.oldFund?.createTime !== createTime ? createTime : undefined,
      type: this.fundsForm.type,
      status: this.fundsForm.status
    }
    const result = await apiUpdateFunds(param)
    if (result.status) {
      this.$message.success('更新成功')
      if (this.oldFund !== undefined) {
        const idx = this.fundsList.indexOf(this.oldFund)
        this.fundsList.splice(idx, 1)
        if (result.data.status === 1) {
          this.fundsList.push(result.data)
        }
      }

      if (!this.isShowFundsList) {
        this.updateChart()
      }
    }
    this.fundsFormVisible = false
    this.fundLoading = false
  }

  private addFundButton () {
    this.fundTitle = '添加资金流水'
    this.fundIsAdd = true
    this.createTimeDisable = true
    this.changeCreateTimeVal = '编辑'
    this.fundsForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
    this.fundsFormVisible = true
  }

  private updateFundButton (fund: IRetFunds) {
    this.oldFund = fund

    this.fundsForm.id = fund.id
    this.fundsForm.amount = fund.amount
    this.fundsForm.memo = fund.memo
    this.fundsForm.createTime = this.descTime(fund.createTime)
    this.fundsForm.updateTime = this.descTime(fund.updateTime)
    this.fundsForm.category = fund.category
    this.fundsForm.type = fund.type
    this.fundsForm.status = fund.status

    this.fundCategoryOptions = this.fundsForm.type === 1 ? fundCategoryOptions1 : fundCategoryOptions2

    this.fundTitle = '更新资金流水'
    this.fundIsAdd = false
    this.fundsFormVisible = true
  }

  private changeType () {
    if (this.fundsForm.type === 1) {
      this.fundCategoryOptions = fundCategoryOptions1
    } else if (this.fundsForm.type === 2) {
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

  private descTime (createTime: number) {
    return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
  }

  private descCategory (c: number) {
    let categories = fundCategoryOptions1
    if (c > 100) {
      categories = fundCategoryOptions2
    }

    let l = ''
    for (const d of categories) {
      if (d.value === c) {
        l = d.label
        break
      }
    }
    return l
  }

  private descType (t: number) {
    let l = ''
    for (const d of fundTypeOptions) {
      if (d.value === t) {
        l = d.label
        break
      }
    }
    return l
  }

  private changeCreateTime () {
    this.createTimeDisable = !this.createTimeDisable
    if (this.createTimeDisable) {
      this.changeCreateTimeVal = '编辑'
    } else {
      this.changeCreateTimeVal = '取消'
    }
  }

  private filterHandler (value: number, row: any, column: any) {
    const property = column['property']
    return row[property] === value
  }
}
</script>
