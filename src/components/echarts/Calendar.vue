<template>
  <div>
    <el-row :gutter="10">
      <el-col>
        <div id="timerCalendar" style="width: 100%; height:560px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import { timerTypeList } from '@/constant/timerConstant'
import moment from 'moment'
import { apiListTimer } from '@/api/timer'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Calendar'
})
export default class extends Vue {
  private cellSize = [80, 80]
  private pieRadius = 30
  private calendarYearMonth = '1970-01'
  private scatterData: any[] = []
  private timerChart: ECharts | undefined
  private timerOption = {
    tooltip: {},
    legend: {
      data: timerTypeList,
      bottom: 20
    },
    calendar: {
      top: 'middle',
      left: 'center',
      orient: 'vertical',
      cellSize: [80, 80],
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
      range: this.calendarYearMonth
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
          offset: [-this.cellSize[0] / 2 + 10, -this.cellSize[1] / 2 + 10],
          textStyle: {
            color: '#000',
            fontSize: 14
          }
        }
      },
      data: this.scatterData
    }]
  }

  mounted () {
    if (UserModule.userProfile !== undefined) {
      this.initCalendar()
    }
  }

  // private getPie (c: string) {
  //   let center = this.timerChart?.convertToPixel('calendar', c);
  //   return {
  //     type: 'pie',
  //     center: center,
  //     label: {
  //       normal: {
  //         formatter: '{c}',
  //         position: 'inside'
  //       }
  //     },
  //     radius: this.pieRadius,
  //     data: [
  //       { name: '工作', value:  },
  //       { name: '娱乐', value: Math.round(Math.random() * 24) },
  //       { name: '睡觉', value: Math.round(Math.random() * 24) }
  //     ]
  //   };
  // }

  private async initCalendar () {
    const param = {
      selectedMonth: moment().format('YYYY-MM')
    }
    const result = await apiListTimer(param)
    if (result.status) {
      const data = result.data

      const pieSeries = []
      for (const k in Object.keys(data)) {
        this.scatterData.push([k, 1])
        // const pie = this.getPie()
        pieSeries.push()
      }

      this.calendarYearMonth = this.scatterData[0][0].substr(0, 7)

      this.timerChart = echarts.init(<HTMLDivElement>document.getElementById('timerCalendar'))
      // @ts-ignore
      this.timerChart.setOption(this.timerOption)
    }
  }
}
</script>
