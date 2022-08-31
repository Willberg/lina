<template>
  <div>
    <Nav></Nav>
    <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 10px;">
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
        <div style="margin-top: 10px;">功能：</div>
      </el-col>
      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
        <el-button type="primary" @click.native.prevent="handleAdd">添加题目</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top: 10px;" :gutter="10">
      <el-col :xs="16" :sm="14" :md="12" :lg="8" :xl="8">
        <el-date-picker
          v-model="dateTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-col>

      <el-col :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="ojList"
      :default-sort="{prop: 'id', order: 'descending'}"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%; margin-top: 10px;">
      <el-table-column
        sortable
        fixed="left"
        align="center"
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="pid"
        label="题号">
        <template slot-scope="scope">
          <el-button @click="handleLink(scope.row.link)" type="text" size="small">{{ scope.row.pid }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="ojType"
        :filters="filterProblemSetArray"
        :filter-method="filterHandler"
        label="题库">
        <template slot-scope="scope">
          {{ descOjType(scope.row.ojType) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="题目">
      </el-table-column>
      <el-table-column
        align="center"
        prop="difficulty"
        label="难度">
      </el-table-column>
      <el-table-column
        align="center"
        prop="type"
        :filters="filterProblemTypeArray"
        :filter-method="filterHandler"
        label="类别">
      </el-table-column>
      <el-table-column
        align="center"
        width="180"
        prop="useTime"
        label="用时">
        <template slot-scope="scope">
          <div v-if="scope.row.id===timerId" style="color: red">
            {{ timer }}
          </div>
          <div v-else>{{ calTimerFormatUseTime(scope.row.useTime) }}({{ scope.row.useTime }}秒)</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="standalone"
        label="参考题解">
      </el-table-column>
      <el-table-column
        align="center"
        prop="study"
        label="学习题解">
      </el-table-column>
      <el-table-column
        sortable
        width="160"
        align="center"
        prop="createTime"
        label="创建时间">
        <template slot-scope="scope">
          {{ descTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="160"
        prop="updateTime"
        label="更新时间">
        <template slot-scope="scope">
          {{ descTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        :filters="filterStatusArray"
        :filter-method="filterHandler"
        label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'danger' : scope.row.status === 2? 'warning': 'success'"
            disable-transitions>{{ descStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="text" style="color: red" size="small">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :pager-count="pageCount"
        :total="total">
      </el-pagination>
    </div>

    <!-- addForm -->
    <el-dialog title="添加题目" :visible.sync="addFormVisible">
      <el-form :model="addForm">
        <el-form-item label="题号" label-width="140px">
          <el-input v-model="addForm.pid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目" label-width="140px">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="难度" label-width="140px">
          <el-select v-model="addForm.difficulty" placeholder="请选择难度">
            <el-option v-for="d in difficulties" :label="d.label" :value="d.label" :key="d.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题库" label-width="140px">
          <el-select v-model="addForm.ojType" placeholder="请选择题库">
            <el-option v-for="p in problemSet" :label="p.label" :value="p.value" :key="p.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型" label-width="140px">
          <el-select v-model="addForm.type" placeholder="请选择题型">
            <el-option v-for="p in problemType" :label="p.label" :value="p.label" :key="p.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" label-width="140px">
          <el-input v-model="addForm.link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearAddInput">清 空</el-button>
        <el-button type="primary" @click="submitAdd" :loading="addLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- updateForm -->
    <el-dialog title="修改题目" :visible.sync="updateFormVisible">
      <el-form :model="updateForm">
        <el-form-item label="题号" label-width="140px">
          <el-input v-model="updateForm.pid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目" label-width="140px">
          <el-input v-model="updateForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="难度" label-width="140px">
          <el-select v-model="updateForm.difficulty" placeholder="请选择难度">
            <el-option v-for="d in difficulties" :label="d.label" :value="d.label" :key="d.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题库" label-width="140px">
          <el-select v-model="updateForm.ojType" placeholder="请选择题库">
            <el-option v-for="p in problemSet" :label="p.label" :value="p.value" :key="p.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型" label-width="140px">
          <el-select v-model="updateForm.type" placeholder="请选择题型">
            <el-option v-for="p in problemType" :label="p.label" :value="p.label" :key="p.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用时" label-width="140px">
          <el-row :gutter="20" type="flex">
            <el-col>
              <div v-show="useTimeVisible">
                <div v-if="updateForm.id===timerId" style="color: red">{{ timer }}</div>
                <div v-else>{{ calTimerFormatUseTime(updateForm.useTime) }}({{ updateForm.useTime }}秒)</div>
              </div>
              <el-input v-show="!useTimeVisible" v-model="updateForm.useTime" autocomplete="off"></el-input>
            </el-col>
            <el-col>
              <el-button type="primary" @click="handleUseTime">编辑</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="参考题解" label-width="140px">
          <el-select v-model="updateForm.standalone" placeholder="请选择是否">
            <el-option v-for="c in choices" :label="c.label" :value="c.label" :key="c.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习题解" label-width="140px">
          <el-select v-model="updateForm.study" placeholder="请选择是否">
            <el-option v-for="c in choices" :label="c.label" :value="c.label" :key="c.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接" label-width="140px">
          <el-input v-model="updateForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="140px">
          <el-select v-model="updateForm.status" placeholder="请选择状态">
            <el-option v-for="s in statusSet" :label="s.label" :value="s.value" :key="s.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearUpdateInput">清 空</el-button>
        <el-button type="primary" @click="submitUpdate" :loading="updateLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import {
  cvtTimeMillisByDateTimeStr,
  nowTimeMillis,
  startDateTimeStr,
  thisStartMonthDay,
  timeMillis2DateTime
} from '@/utils/time'
import moment from 'moment'
import { UserModule } from '@/store/modules/user'
import { add, count, list, update } from '@/api/oj'
import {
  choices,
  difficulties,
  problemSet,
  problemSetFilterArray,
  problemType,
  problemTypeArray,
  statusFilterArray,
  statusSet
} from '@/constant/ojConstant'
import { IOj, IOjUpdate } from '@/types/todo/types'
import { filterHandlerMethod } from '@/utils/table'
import { getUser } from '@/api/user'

@Component({
  name: 'Oj',
  components: {
    Nav
  }
})
export default class extends Vue {
  private difficulties = difficulties
  private problemSet = problemSet
  private problemType = problemType
  private choices = choices
  private statusSet = statusSet

  private dateTimeRange: string[] | null = []
  private currentPage = 1
  private pageSizes = ['10000', '10', '20', '50', '100']
  private pageSize = 10000
  private pageCount = 5
  private total = 10
  private listLoading = false
  private ojList: any[] = []
  private filterProblemTypeArray = problemTypeArray
  private filterProblemSetArray = problemSetFilterArray
  private filterStatusArray = statusFilterArray
  private filterHandler = filterHandlerMethod

  private timerId = -1
  private countdownTimer: any | undefined
  private timerUseTime = 0
  private timer = ''

  private addFormVisible = false
  private addLoading = false
  private addForm: any = {}

  private updateFormVisible = false
  private useTimeVisible = true
  private updateLoading = false
  private updateForm: any = {}
  private oldOj: any = {}

  mounted () {
    this.dateTimeRange = [
      thisStartMonthDay(),
      startDateTimeStr(moment().add(1, 'days'))
    ]

    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      this.getUserAndInitData()
    } else {
      this.searchList()
    }
  }

  beforeDestroy () {
    // 清除定时刷新，不清除会一直运行，关闭页面也会定时刷新
    if (this.countdownTimer !== undefined) {
      clearInterval(this.countdownTimer)
    }
  }

  private updateTimerUseTime () {
    this.timerUseTime++
    this.timer = this.calTimerFormatUseTime(this.timerUseTime) + '(' + this.timerUseTime + '秒)'
  }

  private calTimerFormatUseTime (time: number) {
    const h = parseInt((time / 3600).toString())
    const m = parseInt(((time % 3600) / 60).toString())
    const s = (time % 3600) % 60
    return h + '时' + m + '分' + s + '秒'
  }

  private descOjType = (ojType: number) => {
    if (ojType === 1) {
      return 'leetcode'
    } else if (ojType === 2) {
      return 'codeforces'
    } else {
      return ''
    }
  }

  private descStatus = (status: number) => {
    if (status === 1) {
      return '开始'
    } else if (status === 2) {
      return '暂停'
    } else {
      return '结束'
    }
  }

  private async getUserAndInitData () {
    const result = await getUser()
    if (result.status) {
      UserModule.setUser(result.data)
      await this.searchList()
    }
  }

  private async searchList () {
    // 已登录，加载初始数据
    const status = await this.getList()
    if (status) {
      // 获取数据总量
      await this.getTotal()
    }
  }

  private descTime (ts: number) {
    return timeMillis2DateTime(ts)
  }

  private handleSizeChange (val: number) {
    this.pageSize = val
  }

  private handleCurrentChange (val: number) {
    this.currentPage = val
    this.searchList()
  }

  private async getList () {
    this.listLoading = true
    const startTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[0]) : undefined
    const endTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[1]) : undefined
    const param = {
      offset: (this.currentPage - 1) * this.pageSize,
      count: this.pageSize,
      begin: startTime,
      end: endTime
    }
    const result = await list(param)
    // 拉取数据时要清空原来的数据
    this.ojList.splice(0, this.ojList.length)
    if (result.status) {
      for (const t of result.data) {
        if (t.status === 1) {
          this.addTimer(t.id, t.useTime, t.preTime)
        }
        this.ojList.push(t)
      }
    }
    this.listLoading = false
    return result.status
  }

  private async getTotal () {
    const begin = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[0]) : undefined
    const end = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[1]) : undefined
    const param = {
      begin: begin,
      end: end
    }
    const result = await count(param)
    if (result.status) {
      this.total = result.data
    }
  }

  private handleLink = (link: string) => {
    window.open(link)
  }

  private handleAdd () {
    this.addFormVisible = true
  }

  private clearAddInput () {
    this.addForm = {}
  }

  private async submitAdd () {
    if (this.timerId > 0) {
      this.$message.error('请先暂停或是完成正在进行中的题目')
      this.addFormVisible = false
      return
    }
    if (this.addForm.pid === undefined ||
      this.addForm.name === undefined ||
      this.addForm.difficulty === undefined ||
      this.addForm.ojType === undefined ||
      this.addForm.type === undefined ||
      this.addForm.link === undefined) {
      this.$message.error('请填写题目信息')
      return
    }

    this.addLoading = true
    const param = {
      pid: this.addForm.pid,
      name: this.addForm.name,
      difficulty: this.addForm.difficulty,
      ojType: this.addForm.ojType,
      type: this.addForm.type,
      preTime: nowTimeMillis(),
      link: this.addForm.link
    }
    const result = await add(param)
    if (result.status) {
      const t = result.data
      this.addTimer(t.id, t.useTime, t.preTime)
      this.ojList.unshift(t)
      this.clearAddInput()
      this.$message.success('添加成功')
    }
    this.addLoading = false
    this.addFormVisible = false
  }

  private addTimer (id: number, useTime: number, preTime: number) {
    this.timerId = id
    this.timerUseTime = parseInt((useTime + (nowTimeMillis() - preTime) / 1000).toString())
    if (this.countdownTimer !== undefined) {
      clearInterval(this.countdownTimer)
    }
    const updateTimerUseTime = this.updateTimerUseTime
    this.countdownTimer = setInterval(function () {
      updateTimerUseTime()
    }, 1000)
  }

  private handleEdit (oj: IOj) {
    this.updateFormVisible = true
    this.oldOj = oj
    // 深拷贝
    this.updateForm = JSON.parse(JSON.stringify(oj))
  }

  private async handleDelete (id: number) {
    this.listLoading = false
    const param: IOjUpdate = {
      id: id,
      preTime: nowTimeMillis(),
      status: 4
    }
    const result = await update(param)
    if (result.status) {
      let idx = -1
      this.ojList.forEach((o, i) => {
        if (o.id === id) {
          idx = i
        }
      })
      if (this.ojList[idx].status === 1) {
        this.clearTimer()
      }
      this.ojList.splice(idx, 1)
      this.$message.success('删除记录成功, ID: ' + id)
    }
    this.listLoading = false
  }

  private clearTimer () {
    this.timerId = -1
    clearInterval(this.countdownTimer)
  }

  private handleUseTime () {
    this.useTimeVisible = !this.useTimeVisible
  }

  private clearUpdateInput () {
    this.updateForm = {}
  }

  private async submitUpdate () {
    let needUpdate = false
    for (const key in this.updateForm) {
      if (this.oldOj[key] !== this.updateForm[key]) {
        needUpdate = true
        break
      }
    }
    if (!needUpdate) {
      this.updateFormVisible = false
      this.$message.success('不需要更新')
      return
    }
    const param: IOjUpdate = {
      id: this.updateForm.id,
      preTime: nowTimeMillis()
    }
    if (this.oldOj.status !== this.updateForm.status) {
      if (this.oldOj.status !== 1 && this.updateForm.status === 1 && this.timerId > 0) {
        this.$message.error('请先完成或暂停正在进行中的题目')
        this.updateFormVisible = false
        return
      }
      param.status = this.updateForm.status
    }
    if (this.oldOj.pid !== this.updateForm.pid) {
      param.pid = this.updateForm.pid
    }
    if (this.oldOj.name !== this.updateForm.name) {
      param.name = this.updateForm.name
    }
    if (this.oldOj.difficulty !== this.updateForm.difficulty) {
      param.difficulty = this.updateForm.difficulty
    }
    if (this.oldOj.ojType !== this.updateForm.ojType) {
      param.ojType = this.updateForm.ojType
    }
    if (this.oldOj.type !== this.updateForm.type) {
      param.type = this.updateForm.type
    }
    if (this.oldOj.useTime !== this.updateForm.useTime) {
      param.useTime = this.updateForm.useTime
    }
    if (this.oldOj.standalone !== this.updateForm.standalone) {
      param.standalone = this.updateForm.standalone
    }
    if (this.oldOj.study !== this.updateForm.study) {
      param.study = this.updateForm.study
    }
    if (this.oldOj.link !== this.updateForm.link) {
      param.link = this.updateForm.link
    }
    this.updateLoading = true
    const result = await update(param)
    if (result.status) {
      const newOj = result.data
      if (newOj.status === 1) {
        this.addTimer(this.oldOj.id, this.oldOj.useTime, this.oldOj.preTime)
      } else {
        if (this.oldOj.status === 1) {
          this.clearTimer()
        }
      }
      for (const key in newOj) {
        this.oldOj[key] = newOj[key]
      }
      this.$message.success('更新成功')
    }
    this.updateLoading = false
    this.updateFormVisible = false
  }
}
</script>
