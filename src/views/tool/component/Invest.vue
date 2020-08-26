<template>
  <div>
    <el-row style="margin-top: 20px;" :gutter="10">
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        总金额(万元)
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="totalAmount" placeholder="请输入总金额"></el-input>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        首付比例（%）
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="downPayRate" placeholder="请输入首付比例"></el-input>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        贷款年利率（%）
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="lendYearRate" placeholder="请输入贷款年利率"></el-input>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        贷款年数
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="lendYear" placeholder="请输入贷款年数"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;" :gutter="10">
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        房价年增率（%）
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="buildingRate" placeholder="请输入房价年增率"></el-input>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        投资回报率（%）
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-input v-model="investRate" placeholder="请输入投资回报率"></el-input>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="margin-top: 10px;">
        租售比
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-tooltip content="（1/200（0.005）-1/300（0.0034）合理，越小买房越不合算）" placement="top">
          <el-input v-model="rentBugRate" placeholder="请输入租售比"></el-input>
        </el-tooltip>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-button type="primary" @click="calInvest" :loading="calLoading">计算</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;" :gutter="10">
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-button type="primary" @click="managementVisible=true">物业费</el-button>
      </el-col>
      <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
        <el-button type="primary" @click="plotVisible=true">容积率</el-button>
      </el-col>
    </el-row>

    <el-table
      v-show="isShowCal"
      v-loading="calLoading"
      :data="lendTable"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        align="center"
        prop="lendType"
        label="类别">
      </el-table-column>
      <el-table-column
        align="center"
        prop="lendRate"
        label="贷款月利率(%)">
      </el-table-column>
      <el-table-column
        align="center"
        prop="lendPeriod"
        label="期数">
      </el-table-column>
      <el-table-column
        align="center"
        prop="downPay"
        label="首付（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="monthlyPay"
        label="月供（元）">
        <template slot-scope="scope">
          <div v-show="scope.row.lendType==='等额本息'">
            {{scope.row.monthlyPay}}
          </div>
          <div v-show="scope.row.lendType==='等额本金'">
            <el-button @click="showDialog" type="text" size="small">详情</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalRepay"
        label="总还款（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalInterest"
        label="总利息（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalLendRate"
        label="贷款总利率(%)">
      </el-table-column>
      <el-table-column
        align="center"
        prop="originalTotalRepay"
        label="理论总还款（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="originalTotalInterest"
        label="理论总利息（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="originalTotalLendRate"
        label="理论贷款总利率(%)">
      </el-table-column>
      <el-table-column
        align="center"
        prop="diff"
        label="差额(元)">
      </el-table-column>
    </el-table>

    <el-table
      v-loading="calLoading"
      v-show="isShowCal"
      :data="investTable"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        align="center"
        prop="investType"
        label="类别">
      </el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="最终总金额(元)">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalYearRate"
        label="最终年回报率（%）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="monthYearRate"
        label="月回报率（%）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="investMoney"
        label="投资额（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="investInterest"
        label="投资收益额（元）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="investTotalRate"
        label="投资总收益率（%）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="rentTotalMoney"
        label="租房总金额（元）">
      </el-table-column>
    </el-table>

    <!--  等额本金月付  -->
    <el-dialog title="等额本金月付" :visible.sync="equalPrincipalVisible">
      <el-row v-for="item in monthlyPayEqualPrincipalList" :key="item">
        <el-col :xs="12" :sm="12" :md="10" :lg="8" :xl="8">
          {{item}}
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="monthlyPayEqualPrincipalList" @click="equalPrincipalVisible=false">
          拷 贝
        </el-button>
        <el-button @click="equalPrincipalVisible=false">取 消</el-button>
      </div>
    </el-dialog>

    <!--  物业费  -->
    <el-dialog title="等额本金月付" :visible.sync="managementVisible">
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          物业费（元/平方米·月）
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-input v-model="managementFee" placeholder="请输入物业费"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          建筑面积（平米）
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-input v-model="buildingArea" placeholder="请输入建筑面积"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          使用面积（平米）
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-input v-model="useArea" placeholder="请输入使用面积"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          年物业费：
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <b style="color: #30B08F">{{totalManagementFee}}</b>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          建筑均价：
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <b style="color: #30B08F">{{buildingAvgMoney}}</b>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10" style="margin-top: 10px;">
          使用均价：
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <b style="color: #30B08F">{{useAvgMoney}}</b>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="calManagementFee">计算</el-button>
        <el-button @click="managementVisible=false">取 消</el-button>
      </div>
    </el-dialog>

    <!--  容积率  -->
    <el-dialog title="容积率" :visible.sync="plotVisible">
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
          小区面积（平米）
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-input v-model="districtArea" placeholder="请输入物业费"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
          小区建筑面积（平米）
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-input v-model="districtBuildingArea" placeholder="请输入建筑面积"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
          <el-tooltip content="高层住宅(10层以上)容积率应不超过5，多层住宅（六层及以下）应不超过3，绿地率应不低于30%,越小越好" placement="top">
            <div>容积率</div>
          </el-tooltip>
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <b style="color: #30B08F">{{plotRatio}}</b>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="calPlotRatio">计算</el-button>
        <el-button @click="plotVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IInvest, ILend } from '@/types/invest/invest'

@Component({
  name: 'Invest'
})
export default class extends Vue {
  // 总金额(元)
  private totalAmount = 100
  // 首付比例
  private downPayRate = 30
  // 贷款年利率
  private lendYearRate = 5
  // 贷款月利率
  private lendMonthRate = 5
  // 贷款年数
  private lendYear = 30

  // 首付
  private downPay = 0
  // 贷款金额
  private lendMoney = 0
  // 期数
  private lendPeriod = 0
  // 等额本金月付
  private monthlyPayEqualPrincipalList: string[] = []
  // 等额本金还款总额
  private totalRepayEqualPrincipal = 0
  // 等额本金总利息
  private totalInterestEqualPrincipal = 0
  // 等额本金还款总额(原本)
  private totalRepayEqualPrincipalOriginal = 0
  // 等额本金总利息(原本)
  private totalInterestEqualPrincipalOriginal = 0

  // 等额本息月付
  private monthlyPayEqualInterest = 0
  // 等额本息还款总额
  private totalRepayEqualInterest = 0
  // 等额本息总利息
  private totalInterestEqualInterest = 0
  // 等额本息还款总额(原本)
  private totalRepayEqualInterestOriginal = 0
  // 等额本息总利息(原本)
  private totalInterestEqualInterestOriginal = 0

  // 投资回报率
  private investRate = 6
  // 房价年增率
  private buildingRate = 2
  // 月投资回报率
  private monthInvestRate = 5
  // 月房价年增率
  private monthBuildingRate = 10
  // 投资收益
  private totalInterestInvest = 0
  // 房产收益
  private buildingInterestInvest = 0
  // 租售比
  private rentBugRate = 0.0012

  private equalPrincipalVisible = false

  private isShowCal = false
  private calLoading = false
  private lendTable: ILend[] = []
  private investTable: IInvest[] = []

  private managementVisible = false
  private managementFee = 1
  private buildingArea = 100
  private useArea = 80
  private totalManagementFee = ''
  private buildingAvgMoney = ''
  private useAvgMoney = ''

  private plotVisible = false
  private districtArea = 10000
  private districtBuildingArea = 50000
  private plotRatio = ''

  private showDialog () {
    this.equalPrincipalVisible = true
  }

  private calInvest () {
    this.calLoading = true
    this.isShowCal = true

    // 计算初始参数
    this.lendMonthRate = this.descRate(this.lendYearRate / 12, 2)
    this.monthInvestRate = this.descRate(this.investRate / 12, 2)
    this.monthBuildingRate = this.descRate(this.buildingRate / 12, 2)

    // 计算房贷相关信息
    const t = this.totalAmount * 10000
    this.downPay = Math.ceil(t * this.downPayRate) / 100
    this.lendPeriod = this.lendYear * 12
    this.lendMoney = t - this.downPay

    const b = this.descRate(this.lendMonthRate / 100, 4)
    this.monthlyPayEqualInterest = this.calMonthlyPayEqualInterest(this.lendMoney, b, this.lendPeriod)
    this.totalRepayEqualInterest = this.monthlyPayEqualInterest * this.lendPeriod
    this.totalInterestEqualInterest = this.totalRepayEqualInterest - this.lendMoney

    this.totalRepayEqualPrincipal = 0
    let investTotalInterest = 0
    let investTotalMoney = 0
    let rentTotalMoney = 0
    this.monthlyPayEqualPrincipalList = []
    const p = this.descRate(this.monthInvestRate / 100, 4)
    for (let i = 0; i < this.lendPeriod; i++) {
      const monthlyPayEqualPrincipal = this.calMonthlyPayEqualPrincipal(this.lendMoney, b, i + 1, this.lendPeriod)
      const mr = '第' + (i + 1) + '期月供： '.concat(this.descAmount(monthlyPayEqualPrincipal, 4)).concat(' 元')
      this.monthlyPayEqualPrincipalList.push(mr)
      this.totalRepayEqualPrincipal += monthlyPayEqualPrincipal

      const rentMoney = this.calMonthlyPayForRent(i + 1)
      const investMoney = monthlyPayEqualPrincipal - rentMoney
      rentTotalMoney += rentMoney
      investTotalMoney += monthlyPayEqualPrincipal
      if (investMoney > 0) {
        const investInterest = investMoney * ((1 + p) ** (this.lendPeriod - i))
        investTotalInterest += investInterest
      }
    }
    this.totalRepayEqualPrincipal = Math.ceil(this.totalRepayEqualPrincipal * 100) / 100
    this.totalInterestEqualPrincipal = this.totalRepayEqualPrincipal - this.lendMoney

    this.totalRepayEqualPrincipalOriginal = this.calOriginalTotalEqualPrincipal()
    this.totalInterestEqualPrincipalOriginal = this.calOriginalTotalInterest(this.lendMoney, this.totalRepayEqualPrincipalOriginal)
    this.totalRepayEqualInterestOriginal = this.calOriginalTotalEqualInterest()
    this.totalInterestEqualInterestOriginal = this.calOriginalTotalInterest(this.lendMoney, this.totalRepayEqualInterestOriginal)

    const bRate = this.buildingRate / 100
    this.buildingInterestInvest = t * ((1 + bRate) ** this.lendYear) - (this.downPay + this.totalRepayEqualPrincipal)
    this.buildingInterestInvest = Math.ceil(this.buildingInterestInvest * 100) / 100

    const downPayInterest = this.downPay * (1 + p) ** this.lendPeriod - this.downPay
    this.totalInterestInvest = Math.ceil((downPayInterest + investTotalInterest - investTotalMoney - rentTotalMoney) * 100) / 100

    this.lendTable = []
    this.lendTable.push({
      lendType: '等额本息',
      lendRate: this.lendMonthRate,
      lendPeriod: this.lendPeriod,
      downPay: this.descAmount(this.downPay, 4),
      monthlyPay: this.descAmount(this.monthlyPayEqualInterest, 4),
      totalRepay: this.descAmount(this.totalRepayEqualInterest, 4),
      totalInterest: this.descAmount(this.totalInterestEqualInterest, 4),
      totalLendRate: this.calRate(this.lendMoney, this.totalInterestEqualInterest),
      originalTotalRepay: this.descAmount(this.totalRepayEqualInterestOriginal, 4),
      originalTotalInterest: this.descAmount(this.totalInterestEqualInterestOriginal, 4),
      originalTotalLendRate: this.calRate(this.lendMoney, this.totalInterestEqualInterestOriginal),
      diff: this.descAmount(this.totalInterestEqualInterest - this.totalInterestEqualInterestOriginal, 4)
    })
    this.lendTable.push({
      lendType: '等额本金',
      lendRate: this.lendMonthRate,
      lendPeriod: this.lendPeriod,
      downPay: this.descAmount(this.downPay, 4),
      monthlyPay: '',
      totalRepay: this.descAmount(this.totalRepayEqualPrincipal, 4),
      totalInterest: this.descAmount(this.totalInterestEqualPrincipal, 4),
      totalLendRate: this.calRate(this.lendMoney, this.totalInterestEqualPrincipal),
      originalTotalRepay: this.descAmount(this.totalRepayEqualPrincipalOriginal, 4),
      originalTotalInterest: this.descAmount(this.totalInterestEqualPrincipalOriginal, 4),
      originalTotalLendRate: this.calRate(this.lendMoney, this.totalInterestEqualPrincipalOriginal),
      diff: this.descAmount(this.totalInterestEqualPrincipal - this.totalInterestEqualPrincipalOriginal, 4)
    })

    this.investTable = []
    this.investTable.push({
      investType: '等额本金',
      total: this.descAmount(this.add(this.totalRepayEqualPrincipal + this.downPay, this.buildingInterestInvest), 4),
      totalYearRate: this.calRateAvg(this.lendYear, this.calRate(this.add(this.totalRepayEqualPrincipal, this.downPay), this.buildingInterestInvest)),
      monthYearRate: this.monthBuildingRate,
      investMoney: this.descAmount(this.add(this.totalRepayEqualPrincipal, this.downPay), 4),
      investInterest: this.descAmount(this.buildingInterestInvest, 4),
      investTotalRate: this.calRate(this.add(this.totalRepayEqualPrincipal, this.downPay), this.buildingInterestInvest),
      rentTotalMoney: '0.00'
    })
    this.investTable.push({
      investType: '投资(住房相同)',
      total: this.descAmount(this.add(investTotalMoney + this.downPay, this.totalInterestInvest), 4),
      totalYearRate: this.calRateAvg(this.lendYear, this.calRate(this.add(investTotalMoney, this.downPay), this.totalInterestInvest)),
      monthYearRate: this.monthInvestRate,
      investMoney: this.descAmount(this.add(investTotalMoney, this.downPay), 4),
      investInterest: this.descAmount(this.totalInterestInvest, 4),
      investTotalRate: this.calRate(this.add(investTotalMoney, this.downPay), this.totalInterestInvest),
      rentTotalMoney: this.descAmount(rentTotalMoney, 4)
    })
    this.calLoading = false
  }

  private descAmount (a: number, d: number) {
    let isNegative = false
    if (a < 0) {
      isNegative = true
      a = -a
    }
    const dp = Math.ceil((a - parseInt(a.toString())) * 100) / 100
    a = parseInt((a - dp).toString())
    let dpStr = (dp * 100) % 10 > 0 ? dp.toString() : dp.toString().concat('0')
    if (dp === 0) {
      dpStr = '0.00'
    }
    let b = 1
    for (let i = 0; i < d; i++) {
      b *= 10
    }
    let intVal = parseInt((a / b).toString())
    let floatVal = (a % b).toString()
    if (intVal !== 0) {
      floatVal = this.descFloatVal(a % b, d)
    }

    let retVal = ''
    while (intVal !== 0) {
      retVal = ','.concat(floatVal).concat(retVal)
      a = intVal
      intVal = parseInt((a / b).toString())
      if (intVal !== 0) {
        floatVal = this.descFloatVal(a % b, d)
      } else {
        floatVal = (a % b).toString()
      }
    }
    retVal = floatVal.concat(retVal).concat(dpStr.substr(1))
    return isNegative ? '-'.concat(retVal) : retVal
  }

  private descFloatVal (floatVal: number, d: number) {
    let n = 0
    let f = floatVal
    for (; n < d; n++) {
      f = parseInt((f / 10).toString())
      if (f === 0) {
        break
      }
    }

    let retStr = floatVal.toString()
    for (let i = 0; i < d - n - 1; i++) {
      retStr = '0'.concat(retStr)
    }
    return retStr
  }

  private descRate (a: number, d: number) {
    let dc = 1
    for (let i = 0; i < d; i++) {
      dc *= 10
    }

    return Math.ceil(a * dc) / dc
  }

  private calRate (a: number, b: number) {
    return Math.ceil((b / a) * 10000) / 100
  }

  private calRateAvg (a: number, b: number) {
    return Math.ceil((b / a) * 100) / 100
  }

  private add (a: number, b: number) {
    return Math.ceil((a + b) * 100) / 100
  }

  private calMonthlyPayEqualPrincipal (a: number, b: number, m: number, n: number) {
    const r = (1 - (m - 1) / n)
    return Math.ceil((a * b * r + a / n) * 100) / 100
  }

  private calOriginalTotalEqualPrincipal () {
    const b = this.lendYearRate / 1200
    const r = this.lendPeriod * b / 2 + 1
    return Math.ceil(this.lendMoney * r * 100) / 100
  }

  private calOriginalTotalInterest (a: number, total: number) {
    return Math.ceil((total - a) * 100) / 100
  }

  private calMonthlyPayEqualInterest (a: number, b: number, n: number) {
    const r = (1 + b) ** n
    return Math.ceil(((a * b * r) / (r - 1)) * 100) / 100
  }

  private calOriginalTotalEqualInterest () {
    const r = this.lendYearRate / 1200
    const p = (1 + r) ** this.lendPeriod
    let retVal = (this.lendMoney * r * p) / (p - 1)
    retVal *= this.lendPeriod
    return Math.ceil(retVal * 100) / 100
  }

  private calMonthlyPayForRent (m: number) {
    const exp = Math.floor((m - 1) / 12)
    const t = this.totalAmount * 10000
    const pay = (t * (1 + this.lendYearRate * 0.01) ** exp) * ((1 + this.buildingRate * 0.01) ** exp) * this.rentBugRate
    return Math.ceil(pay * 100) / 100
  }

  private calManagementFee () {
    const fee = this.managementFee * this.buildingArea * 12
    this.totalManagementFee = this.descAmount(fee, 4) + ' 元'
    this.buildingAvgMoney = this.descAmount(Math.ceil(((this.totalAmount * 10000) / this.buildingArea) * 100) / 100, 4) + ' 元'
    this.useAvgMoney = this.descAmount(Math.ceil(((this.totalAmount * 10000) / this.useArea) * 100) / 100, 4) + ' 元'
  }

  private calPlotRatio () {
    this.plotRatio = (Math.ceil((this.districtBuildingArea / this.districtArea) * 100) / 100).toString()
  }
}
</script>
