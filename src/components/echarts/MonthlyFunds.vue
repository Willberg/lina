<template>
  <div>
    <el-row>
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 10px;">

      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-date-picker v-model="selectedMonth" value-format="yyyy-MM" v-on:change="changeMonth" type="month"
                        placeholder="选择月"></el-date-picker>
      </el-col>
      <el-col :xs="16" :sm="14" :md="8" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-button type="primary" @click="addFunds">添加</el-button>
        <el-button type="warning" @click="updateFunds">修改</el-button>
      </el-col>
    </el-row>
    <div id="monthlyDisbursement" style="width: 100%; height:400px; margin-top: 10px;"></div>
    <div id="monthlyIncomeDisbursement" style="width: 100%; height:400px; margin-top: 10px;"></div>

    <!-- dialog -->
    <!--    <el-dialog title="添加资金流水" :visible.sync="todoGroupFormVisible">-->
    <!--      <el-form :model="todoGroupForm">-->
    <!--        <el-form-item label="最大时长" label-width="120px">-->
    <!--          <el-tooltip content="请填写任务组最长工作时间(分钟)" placement="top">-->
    <!--            <el-input v-model="todoGroupForm.maxTime" autocomplete="off"></el-input>-->
    <!--          </el-tooltip>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="最小优先级" label-width="120px">-->
    <!--          <el-tooltip content="请选择优先级(数字越小优先级越高，表示高于此优先级的任务会优先处理)" placement="top">-->
    <!--            <el-select v-model="todoGroupForm.minPriority" placeholder="请选择优先级">-->
    <!--              <el-option v-for="p in priorities" :label="p.label" :value="p.value"></el-option>-->
    <!--            </el-select>-->
    <!--          </el-tooltip>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="todoGroupFormVisible=false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="submitEdit" :loading="editLoading">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import { apiAddFunds, apiListDisbursements, apiListFunds, apiUpdateFunds } from '@/api/funds'
import moment from 'moment'

@Component({
  name: 'MonthlyDisbursement'
})
export default class extends Vue {
  private fundId = ''
  private fundAmount = ''
  private fundCategory = ''
  private fundType = ''
  private fundStatus = ''

  private isShowDisbursement = true

  private oldSelectedMonth = moment().format('YYYY-MM')
  private selectedMonth = moment().format('YYYY-MM')
  private monthlyDisbursementChart: ECharts | undefined
  private monthlyDisbursementOption = {
    title: {
      text: '月消费组成（单位:元）'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        // 默认为直线，可选为：'line' | 'shadow'
        type: 'shadow'
      },
      // @ts-ignore
      formatter: function (params) {
        let tar = params[1];
        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: ['总费用', '餐饮食物', '服饰美容', '交通出行', '通讯网络', '医疗保健', '住房物业', '图书教育', '娱乐聚餐']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: []
      },
      {
        name: '生活费',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          position: 'inside'
        },
        data: []
      }
    ]
  }

  private monthlyIncomeDisbursementChart: ECharts | undefined
  private monthlyIncomeDisbursementOption = {
    title: {
      text: '月收支组成（单位:元）'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      // @ts-ignore
      formatter: function (params) {
        let tar;
        if (params[1].value !== '-') {
          tar = params[1];
        } else {
          tar = params[0];
        }
        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
      }
    },
    legend: {
      data: ['支出', '收入']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: []
      },
      {
        name: '收入',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          position: 'top'
        },
        data: []
      },
      {
        name: '支出',
        type: 'bar',
        stack: '总量',
        label: {
          show: true,
          position: 'bottom'
        },
        data: []
      }
    ]
  }

  mounted () {
    if (this.isShowDisbursement) {
      this.initMonthlyDisbursementChart()
    } else {
      this.initMonthlyIncomeDisbursementChart()
    }
  }

  private async initMonthlyDisbursementChart () {
    this.monthlyDisbursementChart = echarts.init(<HTMLDivElement>document.getElementById('monthlyDisbursement'))
    await this.setMonthlyDisbursement()
    // @ts-ignore
    this.monthlyDisbursementChart.setOption(this.monthlyDisbursementOption)
  }

  private async setMonthlyDisbursement () {
    const param = {
      selectedMonth: this.selectedMonth
    }
    const result = await apiListDisbursements(param)
    if (result.status) {
      this.oldSelectedMonth = this.selectedMonth

      const d = result.data
      let restMoney = 0
      const keys = ['total', '1', '2', '3', '4', '5', '6', '7', '8']
      this.monthlyDisbursementOption.series[0].data = []
      this.monthlyDisbursementOption.series[1].data = []
      for (const key of keys) {
        const money = d[key] || 0
        if (key === 'total') {
          restMoney = money
          // @ts-ignore
          this.monthlyDisbursementOption.series[0].data.push(0)
        } else {
          restMoney -= money
          // @ts-ignore
          this.monthlyDisbursementOption.series[0].data.push(restMoney)
        }

        // @ts-ignore
        this.monthlyDisbursementOption.series[1].data.push(money)
      }
    }
  }

  private async changeMonth () {
    if (this.selectedMonth != null && this.selectedMonth !== this.oldSelectedMonth) {
      await this.setMonthlyDisbursement()
      // @ts-ignore
      this.monthlyDisbursementChart.setOption(this.monthlyDisbursementOption)
    }
  }

  private async addFunds () {
    const param = {
      amount: parseFloat(this.fundAmount),
      category: parseInt(this.fundCategory),
      type: parseInt(this.fundType)
    }
    const result = await apiAddFunds(param)
    if (result.status) {
      this.$message.success('添加成功')
      await this.updateChart()
    } else {
      this.$message.error('添加失败')
    }
  }

  private async updateFunds () {
    const param = {
      id: parseInt(this.fundId),
      amount: parseFloat(this.fundAmount),
      category: parseInt(this.fundCategory),
      type: parseInt(this.fundType),
      status: parseInt(this.fundStatus)
    }
    const result = await apiUpdateFunds(param)
    if (result.status) {
      this.$message.success('更新成功')
      await this.updateChart()
    } else {
      this.$message.error('更新失败')
    }
  }

  private async updateChart () {
    if (this.isShowDisbursement) {
      await this.setMonthlyDisbursement()
      // @ts-ignore
      this.monthlyDisbursementChart.setOption(this.monthlyDisbursementOption)
    } else {
      await this.setMonthlyIncomeDisbursement()
      // @ts-ignore
      this.monthlyIncomeDisbursementChart.setOption(this.monthlyIncomeDisbursementOption)
    }
  }

  private async initMonthlyIncomeDisbursementChart () {
    this.monthlyIncomeDisbursementChart = echarts.init(<HTMLDivElement>document.getElementById('monthlyIncomeDisbursement'))
    await this.setMonthlyIncomeDisbursement()
    // @ts-ignore
    this.monthlyIncomeDisbursementChart.setOption(this.monthlyIncomeDisbursementOption)
  }

  private async setMonthlyIncomeDisbursement () {
    const param = {
      selectedMonth: this.selectedMonth
    }
    const result = await apiListFunds(param)
    if (result.status) {
      this.oldSelectedMonth = this.selectedMonth

      // {
      //   "2020-08-16": -10.0
      // }


    }
  }
}
</script>
