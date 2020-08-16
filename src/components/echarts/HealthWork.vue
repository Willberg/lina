<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div id="healthyWork" style="width: 100%; height:400px;"></div>
        <div style="width: 100%;">本阶段需要做的事：<b style="color: #409EFF">{{dailyScheduleTxt}}</b></div>
        <div style="width: 100%;">
          本阶段起始时间：<b style="color: #30B08F">{{segmentGap}}</b>,
          本阶段总时长：<b style="color: #30B08F">{{segmentTotalTime}} min</b>,
          本阶段倒计时：<b style="color: #C03639">{{segmentTime}} s</b>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import echarts, { ECharts } from 'echarts'
import moment, { Moment } from 'moment'

@Component({
  name: 'HealthWork'
})
export default class extends Vue {
  private oldStartKey = ''
  private dailyScheduleTxt = ''
  private segmentTotalTime = 0
  private segmentTime = 0
  private segmentGap = ''
  private healthyWorkChart: ECharts | undefined
  private healthyWorkTimer: any | undefined
  private countdownTimer: any | undefined
  private lineStart = 0
  private lineEnd = 1
  private healthyWorkOption = {
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        // name: '作息安排',
        type: 'gauge',
        startAngle: -270,
        endAngle: 89,
        clockwise: false,
        max: 24,
        splitNumber: 12,
        detail: {
          'formatter': function (value: number) {
            let total = Math.ceil(value * 60)
            let hour = parseInt((total / 60).toString())
            let minute = total % 60
            if (hour > 12) {
              return '下午：' + (hour - 12) + '时' + minute + '分'
            } else {
              return '上午：' + hour + '时' + minute + '分'
            }
          }
        },
        data: [{ value: this.calHour(moment()), name: '最佳作息安排' }],
        axisLine: {
          lineStyle: {
            color: [[0.2, '#91c7ae'], [0.8, '#c23531'], [1, '#91c7ae']]
          }
        },
        axisLabel: {
          color: '#91c7ae'
        }
      }
    ]
  }

  private dailyScheduleList: Array<string> = new Array<string>()
  private dailyScheduleMap: Map<string, string> = new Map<string, string>()

  private initDailyScheduleMap () {
    this.dailyScheduleMap.set('7:00', '起床')
    this.dailyScheduleMap.set('7:20', '吃早饭')
    this.dailyScheduleMap.set('8:00', '饭后休息。 上班，乘车部分')
    this.dailyScheduleMap.set('8:30', '上班，走路部分')
    this.dailyScheduleMap.set('9:00', '做最困难工作，最清醒阶段（算法设计，流程设计，新技术积累）')
    this.dailyScheduleMap.set('10:00', '做简单工作（总结，文档整理）')
    this.dailyScheduleMap.set('10:30', '眼睛休息和身体休息')
    this.dailyScheduleMap.set('11:00', '吃水果')
    this.dailyScheduleMap.set('11:20', '做一般性工作（代码编写）')
    this.dailyScheduleMap.set('12:00', '午餐')
    this.dailyScheduleMap.set('12:30', '午休')
    this.dailyScheduleMap.set('13:00', '午睡')
    this.dailyScheduleMap.set('14:00', '做创意性的工作，思维最活跃（基础代码，抽象逻辑代码编写）')
    this.dailyScheduleMap.set('16:00', '喝酸奶，补充血糖')
    this.dailyScheduleMap.set('16:10', '做细致性的工作，最巅峰状态（细节性代码编写，bug修改，测试）')
    this.dailyScheduleMap.set('18:40', '做细致性的工作，最巅峰状态（总结）')
    this.dailyScheduleMap.set('19:00', '晚饭')
    this.dailyScheduleMap.set('19:30', '饭后休息')
    this.dailyScheduleMap.set('19:50', '简单运动（跑步）')
    this.dailyScheduleMap.set('20:00', '阅读，休闲')
    this.dailyScheduleMap.set('22:00', '洗澡，处理杂务')
    this.dailyScheduleMap.set('22:30', '睡觉')

    for (const key of this.dailyScheduleMap.keys()) {
      this.dailyScheduleList.unshift(key)
    }
  }

  mounted () {
    this.initDailyScheduleMap()
    this.healthyWorkChart = echarts.init(<HTMLDivElement>document.getElementById('healthyWork'))
    this.dailyScheduleTxt = this.calDailyScheduleTxt(moment()) || ''
    this.healthyWorkOption.series[0].axisLine.lineStyle.color = this.calColorSegment(this.lineStart, this.lineEnd)
    this.healthyWorkChart.setOption(this.healthyWorkOption)

    const updateHealthyWorkChart = this.updateHealthyWorkChart
    this.healthyWorkTimer = setInterval(function () {
      updateHealthyWorkChart()
    }, 60000)

    const updateHealthyWorkCountdownTimer = this.updateHealthyWorkCountdownTimer
    this.countdownTimer = setInterval(function () {
      updateHealthyWorkCountdownTimer()
    }, 1000)
  }

  beforeDestroy () {
    // 清除定时刷新，不清除会一直运行，关闭页面也会定时刷新
    if (this.healthyWorkTimer !== undefined) {
      clearInterval(this.healthyWorkTimer);
    }

    if (this.countdownTimer !== undefined) {
      clearInterval(this.countdownTimer);
    }
  }

  private updateHealthyWorkChart () {
    const startKey: string[] = []
    const mt = moment()
    this.dailyScheduleTxt = this.calDailyScheduleTxt(mt, startKey) || ''
    const startKeyVal = startKey.pop() || ''
    const [lineStart, lineEnd] = this.adjustDailyScheduleChart(startKeyVal)
    this.healthyWorkOption.series[0].axisLine.lineStyle.color = this.calColorSegment(lineStart, lineEnd)
    this.healthyWorkOption.series[0].data = [{
      value: this.calHour(mt),
      name: '最佳作息安排'
    }]
    this.healthyWorkChart?.setOption(this.healthyWorkOption, true)
  }

  private calColorSegment (lineStart: number, lineEnd: number) {
    if (lineStart < lineEnd) {
      return [[lineStart, '#91c7ae'], [lineEnd, '#c23531'], [1, '#91c7ae']]
    } else {
      return [[lineEnd, '#c23531'], [lineStart, '#91c7ae'], [1, '#c23531']]
    }
  }

  private updateHealthyWorkCountdownTimer () {
    if (this.segmentTime <= 0) {
      // 出现负值时，去根据旧开始值校准时间
      this.adjustSegmentTime()
    }
    this.segmentTime--
  }

  private calHour (m: Moment): number {
    return m.hours() + (m.minutes() / 60)
  }

  private calDailyScheduleTxt (mt: Moment, startKey?: string[]) {
    const v = mt.format('HH:mm')
    let [hour, minute] = this.calHourMinute(v)
    if (hour >= 0 && hour <= 7) {
      hour += 24
    }
    for (const key of this.dailyScheduleList) {
      const [h, m] = this.calHourMinute(key)
      if (h < hour) {
        startKey?.push(key)
        this.adjustDailyScheduleChart(key)
        return this.dailyScheduleMap.get(key)
      } else if (h == hour) {
        if (m <= minute) {
          startKey?.push(key)
          this.adjustDailyScheduleChart(key)
          return this.dailyScheduleMap.get(key)
        }
      }
    }
  }

  private adjustDailyScheduleChart (startKey: string) {
    const startKeyIdx = this.dailyScheduleList.indexOf(startKey)
    const endKeyIdx = startKeyIdx - 1 >= 0 ? startKeyIdx - 1 : this.dailyScheduleList.length - 1
    const endKey = this.dailyScheduleList[endKeyIdx]
    const [startKeyHour, startKeyMinute] = this.calHourMinute(startKey)
    const [endKeyHour, endKeyMinute] = this.calHourMinute(endKey)
    this.segmentGap = startKey + '~' + endKey
    if (this.oldStartKey !== startKey) {
      this.oldStartKey = startKey
      this.segmentTotalTime = Math.abs((endKeyHour * 60 + endKeyMinute) - (startKeyHour * 60 + startKeyMinute))
      // 校准时间
      let startMoment = moment().hours(startKeyHour).minutes(startKeyMinute).seconds(0)
      this.segmentTime = Math.abs((this.segmentTotalTime * 60) - (moment().unix() - startMoment.unix()))
    }
    this.lineStart = parseFloat(((24 * 60 - endKeyHour * 60 - endKeyMinute) / (24 * 60)).toFixed(3))
    this.lineEnd = parseFloat(((24 * 60 - startKeyHour * 60 - startKeyMinute) / (24 * 60)).toFixed(3))
    return [this.lineStart, this.lineEnd]
  }

  private adjustSegmentTime () {
    const [h, m] = this.calHourMinute(this.oldStartKey)
    // 校准时间
    let startMoment = moment().hours(h).minutes(m).seconds(0)
    this.segmentTime = Math.abs((this.segmentTotalTime * 60) - (moment().unix() - startMoment.unix()))
  }

  private calHourMinute (v: string) {
    const [h, m] = v.split(':')
    return [parseInt(h), parseInt(m)]
  }
}
</script>
