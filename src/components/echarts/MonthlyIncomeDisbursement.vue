<template>
  <div>
    <div id="monthlyIncomeDisbursement" style="width: 100%; height:400px; margin-top: 10px;"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import { apiListFunds } from '@/api/funds'
import moment from 'moment'

@Component({
  name: 'MonthlyIncomeDisbursement'
})
export default class extends Vue {
  private selectedMonth = localStorage.getItem('selectedMonth') || moment().format('YYYY-MM')

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
    this.initMonthlyIncomeDisbursementChart()
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

      // {
      //   "2020-08-16": -10.0
      // }


    }
  }
}
</script>
