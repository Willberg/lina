<template>
  <div>
    <div id="monthlyDisbursement" style="width: 100%; height:400px; margin-top: 10px;"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import { apiListDisbursements } from '@/api/funds'
import moment from 'moment'

@Component({
  name: 'MonthlyDisbursement'
})
export default class extends Vue {
  private selectedMonth = localStorage.getItem('selectedMonth') || moment().format('YYYY-MM')

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

  mounted () {
    this.initMonthlyDisbursementChart()
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
      const d = result.data
      let restMoney = 0
      const keys = ['total', '1', '2', '3', '4', '5', '6', '7', '8']
      this.monthlyDisbursementOption.series[0].data = []
      this.monthlyDisbursementOption.series[1].data = []
      for (const key of keys) {
        const money = Math.round((d[key] || 0) * 100) / 100
        if (key === 'total') {
          restMoney = money
          // @ts-ignore
          this.monthlyDisbursementOption.series[0].data.push(0)
        } else {
          restMoney -= money
          restMoney = Math.round(restMoney * 100) / 100
          // @ts-ignore
          this.monthlyDisbursementOption.series[0].data.push(restMoney)
        }

        // @ts-ignore
        this.monthlyDisbursementOption.series[1].data.push(money)
      }
    }
  }
}
</script>
