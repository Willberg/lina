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
import { IFundsChartBar } from '@/types/funds/types'

@Component({
  name: 'MonthlyIncomeDisbursement'
})
export default class extends Vue {
  private selectedMonth = localStorage.getItem('selectedMonth') || moment().format('YYYY-MM')

  private positiveColor = '#c23531'
  private negativeColor = '#2f4554'
  private transparentColor = '#00000000'
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
        data: []
      },
      {
        name: '主要',
        type: 'bar',
        stack: '总量',
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
      let dateArray = Object.keys(result.data).sort((a, b) => {
        const aDate = moment(a, 'YYYY-MM-DD').unix()
        const bData = moment(b, 'YYYY-MM-DD').unix()
        if (aDate > bData) {
          return 1
        } else {
          return -1
        }
      })

      let assistAmount: number = 0
      for (let date of dateArray) {
        // @ts-ignore
        this.monthlyIncomeDisbursementOption.xAxis.data.push(date)

        let assistData: any = ''
        let data: any = ''
        const amount = result.data[date]
        if (amount >= 0) {
          if (assistAmount >= 0) {
            const assistBar: IFundsChartBar = {
              color: this.transparentColor,
              value: assistAmount,
              show: false
            }
            assistData = this.calBarData(assistBar)

            const dataBar: IFundsChartBar = {
              color: this.positiveColor,
              value: amount,
              show: true,
              position: 'top',
              adjust: 0
            }
            data = this.calBarData(dataBar)
          } else {
            if (assistAmount + amount > 0) {
              const assistBar: IFundsChartBar = {
                color: this.positiveColor,
                value: assistAmount,
                show: false
              }
              assistData = this.calBarData(assistBar)

              const dataBar: IFundsChartBar = {
                color: this.positiveColor,
                value: assistAmount + amount,
                show: true,
                position: 'top',
                adjust: -assistAmount
              }
              data = this.calBarData(dataBar)
            } else {
              const assistBar: IFundsChartBar = {
                color: this.transparentColor,
                value: assistAmount + amount,
                show: false
              }
              assistData = this.calBarData(assistBar)

              const dataBar: IFundsChartBar = {
                color: this.positiveColor,
                value: -amount,
                show: true,
                position: 'top',
                adjust: 2 * amount
              }
              data = this.calBarData(dataBar)
            }
          }
        } else {
          if (assistAmount <= 0) {
            const assistBar: IFundsChartBar = {
              color: this.transparentColor,
              value: assistAmount,
              show: false
            }
            assistData = this.calBarData(assistBar)

            const dataBar: IFundsChartBar = {
              color: this.negativeColor,
              value: amount,
              show: true,
              position: 'bottom',
              adjust: -2 * amount
            }
            data = this.calBarData(dataBar)
          } else {
            if (assistAmount + amount < 0) {
              const assistBar: IFundsChartBar = {
                color: this.negativeColor,
                value: assistAmount,
                show: false
              }
              assistData = this.calBarData(assistBar)

              const dataBar: IFundsChartBar = {
                color: this.negativeColor,
                value: assistAmount + amount,
                show: true,
                position: 'bottom',
                adjust: -assistAmount - 2 * amount
              }
              data = this.calBarData(dataBar)
            } else {
              const assistBar: IFundsChartBar = {
                color: this.transparentColor,
                value: assistAmount + amount,
                show: false
              }
              assistData = this.calBarData(assistBar)

              const dataBar: IFundsChartBar = {
                color: this.negativeColor,
                value: -amount,
                show: true,
                position: 'bottom',
                adjust: 0
              }
              data = this.calBarData(dataBar)
            }
          }
        }
        // @ts-ignore
        this.monthlyIncomeDisbursementOption.series[0].data.push(assistData)
        // @ts-ignore
        this.monthlyIncomeDisbursementOption.series[1].data.push(data)
        assistAmount += amount
      }
      console.log(this.monthlyIncomeDisbursementOption.series[0].data)
      console.log(this.monthlyIncomeDisbursementOption.series[1].data)
    }
  }

  private calBarData (bar: IFundsChartBar) {
    if (bar.show) {
      return {
        itemStyle: {
          color: bar.color
        },
        value: bar.value,
        label: {
          show: bar.show,
          position: bar.position,
          // @ts-ignore
          formatter: function (param) {
            return param.value + bar.adjust
          }
        }
      }
    } else {
      return {
        itemStyle: {
          color: bar.color
        },
        value: bar.value,
        label: {
          show: bar.show
        }
      }
    }
  }
}
</script>
