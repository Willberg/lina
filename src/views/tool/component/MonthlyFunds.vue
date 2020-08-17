<template>
  <div>
    <el-row>
      <el-col :xs="14" :sm="12" :md="10" :lg="4" :xl="4" style="margin-top: 10px;">
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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

    <MonthlyDisbursement v-if="!needUpdateChart && optionValue === 1"></MonthlyDisbursement>
    <MonthlyIncomeDisbursement v-if="!needUpdateChart && optionValue===2"></MonthlyIncomeDisbursement>


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
import { apiAddFunds, apiUpdateFunds } from '@/api/funds'
import MonthlyDisbursement from '@/components/echarts/MonthlyDisbursement.vue'
import MonthlyIncomeDisbursement from '@/components/echarts/MonthlyIncomeDisbursement.vue'
import moment from 'moment'
import { fundsOptions } from '@/constant/toolConstant'

@Component({
  name: 'MonthlyFunds',
  components: {
    MonthlyDisbursement,
    MonthlyIncomeDisbursement
  }
})
export default class extends Vue {
  private options = fundsOptions
  private optionValue = 1

  private fundId = ''
  private fundAmount = ''
  private fundCategory = ''
  private fundType = ''
  private fundStatus = ''

  private needUpdateChart = true

  private oldSelectedMonth = moment().format('YYYY-MM')
  private selectedMonth = moment().format('YYYY-MM')

  mounted () {
    localStorage.setItem('selectedMonth', this.selectedMonth)
    this.needUpdateChart = false
  }


  private changeMonth () {
    console.log(this.selectedMonth)
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
    if (this.optionValue == 1) {

    } else if (this.optionValue == 2) {

    }
  }
}
</script>
