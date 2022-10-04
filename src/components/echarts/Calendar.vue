<template>
  <div>
    <el-row v-show="showSelectedMonth">
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 20px;">
        <el-date-picker v-model="selectedMonth" value-format="yyyy-MM" v-on:change="changeMonth" type="month"
                        placeholder="选择月"></el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div id="calendarChart" :style="{ height: calendarChartHeight + 'px'}"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import { timerTypeList, timerTypeMap } from '@/constant/timerConstant'
import moment from 'moment'
import { apiListTimer } from '@/api/timer'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Calendar'
})
export default class extends Vue {
  private showSelectedMonth = false

  private oldSelectedMonth = moment().format('YYYY-MM')
  private selectedMonth = moment().format('YYYY-MM')

  private cellSize = [100, 100]
  private radius = 45
  private calendarChartHeight = 700
  private timerTypeMap = timerTypeMap
  private calendarChart: ECharts | undefined
  private calendarOption = {
    title: {
      text: '月作息日历'
    },
    tooltip: {
      // @ts-ignore
      formatter: function (params) {
        return params.marker + params.data.name + ' : ' + (params.data.value * 14.4).toFixed(1) + '分钟'
          + '(' + (params.data.value * 0.24).toFixed(2) + '小时)'
      }
    },
    legend: {
      data: timerTypeList,
      bottom: 20
    },
    calendar: {
      top: 'middle',
      left: 'center',
      orient: 'vertical',
      cellSize: [],
      yearLabel: {
        show: false,
        textStyle: {
          fontSize: 30
        }
      },
      dayLabel: {
        margin: 20,
        firstDay: 1,
        nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      },
      monthLabel: {
        show: false
      },
      range: ''
    },
    series: [{
      id: 'label',
      type: 'scatter',
      coordinateSystem: 'calendar',
      symbolSize: 1,
      label: {
        normal: {
          show: true,
          formatter: function (params: any) {
            return moment(params.value[0], 'YYYY-MM-DD').format('DD')
          },
          offset: [],
          textStyle: {
            color: '#000',
            fontSize: 14
          }
        }
      },
      data: []
    }]
  }

  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Android') >= 0 || userAgent.indexOf('iPhone') >= 0) {
      const width = Math.floor((document.body.clientWidth - 10) / 7) - 2
      this.cellSize = [width, width]
      this.radius = Math.floor(width / 2) - 3
      this.calendarChartHeight = 460
    }
    const initCalendar = this.initCalendar
    setTimeout(function () {
      // 等待Nav渲染
      if (UserModule.userProfile !== undefined) {
        initCalendar()
      }
    }, 1000)
  }

  private getPie (idx: number, item: any[], data: any) {
    // @ts-ignore
    let center = this.calendarChart.convertToPixel('calendar', item)

    const retData = []
    const ds = 24 * 6 * 6
    for (let key of Object.keys(data)) {
      const useTime = Math.round(data[key] / ds)
      retData.push({
        // @ts-ignore
        name: this.timerTypeMap[key],
        value: useTime
      })
    }

    return {
      id: idx + 'pie',
      type: 'pie',
      center: center,
      label: {
        normal: {
          formatter: '{c}',
          position: 'inside'
        }
      },
      radius: this.radius,
      data: retData
    }
  }

  private async initCalendar () {
    const param = {
      selectedMonth: this.selectedMonth
    }

    const result = await apiListTimer(param)
    if (result.status) {
      this.showSelectedMonth = true
      const data = result.data
      this.calendarChart = echarts.init(<HTMLDivElement>document.getElementById('calendarChart'))
      const cellSize = this.cellSize
      // @ts-ignore
      this.calendarOption.calendar.cellSize = cellSize
      // @ts-ignore
      this.calendarOption.calendar.range = Object.keys(data)[0].substr(0, 7)
      // @ts-ignore
      this.calendarOption.series[0].label.normal.offset = [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10]
      const scatterData = []
      for (const date of Object.keys(data)) {
        scatterData.push([date, 1])
      }
      // @ts-ignore
      this.calendarOption.series[0].data = scatterData
      // @ts-ignore
      this.calendarChart.setOption(this.calendarOption, true)

      let idx = 0
      const pieSeries = []
      for (const date of Object.keys(data)) {
        const pie = this.getPie(idx++, [date, 1], data[date])
        pieSeries.push(pie)
      }

      // @ts-ignore
      this.calendarChart.setOption({
        series: pieSeries
      })
    }
  }

  private changeMonth () {
    if (this.selectedMonth == null || this.selectedMonth === this.oldSelectedMonth) {
      return
    }

    this.initCalendar()
    this.oldSelectedMonth = this.selectedMonth
  }
}
</script>
