<template>
  <div>
    <el-row style="margin-top: 20px;">
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        总金额(万元)
        <el-input v-model="totalAmount" placeholder="请输入总金额"></el-input>
      </el-col>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        首付比例（%）
        <el-input v-model="downPayRate" placeholder="请输入首付比例"></el-input>
      </el-col>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        贷款年利率（%）
        <el-input v-model="lendYearRate" placeholder="请输入贷款年利率"></el-input>
      </el-col>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        贷款年数
        <el-input v-model="lendYear" placeholder="请输入贷款年数"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        房价年增率（%）
        <el-input v-model="buildingRate" placeholder="请输入房价年增率"></el-input>
      </el-col>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        投资回报率（%）
        <el-input v-model="investRate" placeholder="请输入投资回报率"></el-input>
      </el-col>
      <el-col :xs="12" :sm="10" :md="8" :lg="4" :xl="4">
        <el-button @click="calInvest">计算</el-button>
      </el-col>
    </el-row>

    <div v-show="isShowCal">
      <el-row style="margin-top: 10px;">
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" :offset="2">贷款月利率(%)</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">期数</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">首付（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">月供（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">总还款（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">总利息（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">贷款总利率(%)</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">理论总还款（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">理论总利息（元）</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">理论贷款总利率(%)</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">差额(元)</el-col>
      </el-row>
      <el-row>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">等额本息</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{lendMonthRate}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{lendPeriod}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(downPay, 4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(monthlyPayEqualInterest,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalRepayEqualInterest,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalInterestEqualInterest,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{calRate(lendMoney, totalInterestEqualInterest)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalRepayEqualInterestOriginal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalInterestEqualInterestOriginal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{calRate(lendMoney, totalInterestEqualInterestOriginal)}}
        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
          {{descAmount(totalInterestEqualInterest - totalInterestEqualInterestOriginal,4)}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">等额本金</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{lendMonthRate}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{lendPeriod}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(downPay, 4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
          <el-button @click="showDialog" type="text" size="small">详情</el-button>
        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalRepayEqualPrincipal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalInterestEqualPrincipal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{calRate(lendMoney, totalInterestEqualPrincipal)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalRepayEqualPrincipalOriginal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{descAmount(totalInterestEqualPrincipalOriginal,4)}}</el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{calRate(lendMoney, totalInterestEqualPrincipalOriginal)}}
        </el-col>
        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
          {{descAmount(totalInterestEqualPrincipal-totalInterestEqualPrincipalOriginal,4)}}
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px;">
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" :offset="3">最终总金额(元)</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">最终年回报率（%）</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">月回报率（%）</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">投资额（元）</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">投资收益额（元）</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">投资总收益率（%）</el-col>
      </el-row>
      <el-row>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">等额本金</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{descAmount(add(add(totalRepayEqualPrincipal, downPay), buildingInterestInvest),4)}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{calRateAvg(lendYear,calRate(totalRepayEqualPrincipal, buildingInterestInvest))}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{monthBuildingRate}}</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{descAmount(add(totalRepayEqualPrincipal, downPay), 4)}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{descAmount(buildingInterestInvest,4)}}</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{calRate(add(totalRepayEqualPrincipal, downPay), buildingInterestInvest)}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">投资</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{descAmount(add(add(totalRepayEqualPrincipal, downPay), totalInterestInvest),4)}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{calRateAvg(lendYear,calRate(totalRepayEqualPrincipal, totalInterestInvest))}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{monthInvestRate}}</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{descAmount(add(totalRepayEqualPrincipal, downPay), 4)}}
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">{{descAmount(totalInterestInvest,4)}}</el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          {{calRate(add(totalRepayEqualPrincipal, downPay), totalInterestInvest)}}
        </el-col>
      </el-row>
    </div>

    <!--  等额本金月付  -->
    <el-dialog title="等额本金月付" :visible.sync="equalPrincipalVisible">
      <el-row v-for="(item, index) in monthlyPayEqualPrincipalList">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

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
  private investRate = 5
  // 房价年增率
  private buildingRate = 10
  // 月投资回报率
  private monthInvestRate = 5
  // 月房价年增率
  private monthBuildingRate = 10
  // 投资收益
  private totalInterestInvest: number = 0
  // 房产收益
  private buildingInterestInvest: number = 0

  private equalPrincipalVisible = false

  private isShowCal = false

  private showDialog () {
    this.equalPrincipalVisible = true
  }

  private calInvest () {
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
    let investTotalRate = 0
    const p = this.descRate(this.monthInvestRate / 100, 4)
    for (let i = 0; i < this.lendPeriod; i++) {
      let monthlyPayEqualPrincipal = this.calMonthlyPayEqualPrincipal(this.lendMoney, b, i + 1, this.lendPeriod)
      let mr = '第' + (i + 1) + '期月供： '.concat(this.descAmount(monthlyPayEqualPrincipal, 4)).concat(' 元')
      this.monthlyPayEqualPrincipalList.push(mr)
      this.totalRepayEqualPrincipal += monthlyPayEqualPrincipal

      investTotalRate += this.calMonthlyInterestRateInvest(b, i + 1, this.lendPeriod, p)
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

    const downPayInterest = this.downPay * (1 + p) ** this.lendPeriod
    this.totalInterestInvest = Math.ceil((downPayInterest + this.lendMoney * investTotalRate - this.totalRepayEqualPrincipal) * 100) / 100
  }

  private descAmount (a: number, d: number) {
    let dp = Math.ceil((a - parseInt(a.toString())) * 100) / 100
    a = parseInt((a - dp).toString())
    let dpStr = (dp * 100) % 10 > 0 ? dp.toString() : dp.toString().concat('0')
    if (dp == 0) {
      dpStr = '0.00'
    }
    let b = 1
    for (let i = 0; i < d; i++) {
      b *= 10
    }
    let intVal = parseInt((a / b).toString())
    let floatVal = (a % b).toString()
    if (intVal != 0) {
      floatVal = this.descFloatVal(a % b, d)
    }


    let retVal = ''
    while (intVal != 0) {
      retVal = ','.concat(floatVal).concat(retVal)
      a = intVal
      intVal = parseInt((a / b).toString())
      if (intVal != 0) {
        floatVal = this.descFloatVal(a % b, d)
      } else {
        floatVal = (a % b).toString()
      }
    }
    return floatVal.concat(retVal).concat(dpStr.substr(1))
  }

  private descFloatVal (floatVal: number, d: number) {
    let n = 0
    let f = floatVal
    for (; n < d; n++) {
      f = parseInt((f / 10).toString())
      if (f == 0) {
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

  private calMonthlyInterestRateInvest (b: number, m: number, n: number, p: number) {
    const r = 1 - (m - 1) / n
    const v = (1 / n + r * b) * (1 + p) ** (n - m)
    return Math.ceil(v * 10000) / 10000
  }
}
</script>
