<template>
  <div>
    <Nav></Nav>
    <el-row style="margin-top: 10px;" :gutter="10" type="flex">
      <el-col :xs="7" :sm="7" :md="7" :lg="5" :xl="4">
        <el-select v-model="ojType" placeholder="请选择题库" @change="calSummary()">
          <el-option v-for="p in questionBank" :label="p.label" :value="p.value" :key="p.value"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-table
      v-loading="summaryLoading"
      :data="summaryList"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 10px;">
      <el-table-column
        fixed="left"
        align="center"
        prop="difficulty"
        label="难度">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cnt0"
        label="未参考题解">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cnt1"
        label="参考题解">
      </el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="总数">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cnt2"
        label="未学习题解">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cnt3"
        label="未写题解">
      </el-table-column>
      <el-table-column
        align="center"
        prop="cnt4"
        label="用时未达标">
      </el-table-column>
      <el-table-column
        align="center"
        prop="percent"
        label="未参考题解的比例（%）">
      </el-table-column>
    </el-table>

    <el-row style="margin-top: 10px;" :gutter="10">
      <el-col :sm="10" :md="10" :lg="5" :xl="4">
        <el-date-picker
          v-model="dateTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-col>
      <el-col :sm="14" :md="14" :lg="12" :xl="5">
        <el-button type="primary" @click="searchList">查询</el-button>
        <el-button type="primary" @click.native.prevent="handleAdd">添加题目</el-button>
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
        :filters="filterDifficultiesArray"
        :filter-method="filterHandler"
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
        :filters="filterUseTimeArray"
        :filter-method="filterUseTimeHandler"
        label="用时">
        <template slot-scope="scope">
          <div v-if="scope.row.id===timerId" style="color: red">
            {{ timer }}
          </div>
          <div v-else>
            <div v-show="calShowTime(scope.row.difficulty, scope.row.useTime)" style="color: green">
              {{ calTimerFormatUseTime(scope.row.useTime) }}({{ scope.row.useTime }}秒)
            </div>
            <div v-show="!calShowTime(scope.row.difficulty, scope.row.useTime)" style="color: red">
              {{ calTimerFormatUseTime(scope.row.useTime) }}({{ scope.row.useTime }}秒)
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="importance"
        :filters="filterImportanceArray"
        :filter-method="filterHandler"
        label="重要程度">
        <template slot-scope="scope">
          <div v-show="scope.row.importance<=2" style="color: green"> {{ descImportance(scope.row.importance) }}</div>
          <div v-show="scope.row.importance===3" style="color: #e6a23c"> {{
              descImportance(scope.row.importance)
            }}
          </div>
          <div v-show="scope.row.importance===4" style="color: red"> {{ descImportance(scope.row.importance) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="standalone"
        :filters="filterStandaloneArray"
        :filter-method="filterHandler"
        label="参考题解">
        <template slot-scope="scope">
          <div v-show="scope.row.standalone==='否'" style="color: green"> {{ scope.row.standalone }}</div>
          <div v-show="scope.row.standalone==='是'" style="color: red"> {{ scope.row.standalone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="study"
        :filters="filterStudyArray"
        :filter-method="filterHandler"
        label="学习题解">
        <template slot-scope="scope">
          <div v-show="scope.row.study==='是'" style="color: green"> {{ scope.row.study }}</div>
          <div v-show="scope.row.study==='否'" style="color: red"> {{ scope.row.study }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="ansLink"
        :filters="filterAnsLinkArray"
        :filter-method="filterEmptyMethod"
        label="题解">
        <template slot-scope="scope">
          <div v-show="scope.row.ansLink!==undefined && scope.row.ansLink!==''"> 　
            <el-button v-for="(item)  in descAnsMap(scope.row.ansLink)" @click="handleLink(item.link)" type="text"
                       size="small">
              {{ item.language }}
            </el-button>
          </div>
          <div v-show="scope.row.ansLink===undefined || scope.row.ansLink===''" style="color: red"> 否　</div>
        </template>
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
        <el-form-item label="题目链接" label-width="140px">
          <el-input v-model="addForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重要程度" label-width="140px">
          <el-select v-model="addForm.importance" placeholder="请选择重要程度">
            <el-option v-for="i in importances" :label="i.label" :value="i.value" :key="i.value"></el-option>
          </el-select>
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
        <el-form-item label="题目链接" label-width="140px">
          <el-input v-model="updateForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题解链接" label-width="140px">
          <el-row v-show="ansLinkVisible" :gutter="20" type="flex">
            <el-col>
              <el-button v-for="item in ansLinkList" @click="handleLink(item.link)" type="text" size="small">
                {{ item.language }}
              </el-button>
            </el-col>
            <el-col>
              <el-button type="primary" @click="handleEditAnsLink()">编辑</el-button>
            </el-col>
          </el-row>
          <el-row v-show="!ansLinkVisible" :gutter="20" type="flex">
            <el-col>
              <el-select v-model="ansLinkForm.language" placeholder="请选择语言" @change="chooseLanguage()">
                <el-option v-for="l in languages" :label="l.label" :value="l.label" :key="l.label"></el-option>
              </el-select>
            </el-col>
            <el-col>
              <el-input v-model="ansLinkForm.link" autocomplete="off"></el-input>
            </el-col>
            <el-col>
              <el-button type="primary" @click="submitAnsLink()">确定</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="重要程度" label-width="140px">
          <el-select v-model="updateForm.importance" placeholder="请选择重要程度">
            <el-option v-for="i in importances" :label="i.label" :value="i.value" :key="i.value"></el-option>
          </el-select>
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
  ansLinkFilterArray,
  choices,
  difficulties,
  difficultiesArray,
  importanceFilterArray,
  importances,
  languages,
  problemSet,
  problemSetFilterArray,
  problemType,
  problemTypeArray,
  questionBank,
  standaloneFilterArray,
  statusFilterArray,
  statusSet,
  studyFilterArray,
  useTimeFilterArray
} from '@/constant/ojConstant'
import { IOj, IOjUpdate, ISummary } from '@/types/oj/types'
import { filterEmptyMethod, filterHandlerMethod, filterUseTimeHandler } from '@/utils/table'
import { getUser } from '@/api/user'
import { calUseTimeOk } from '@/utils/oj'

@Component({
  name: 'Oj',
  components: {
    Nav
  }
})
export default class extends Vue {
  private ojType = 0
  private summaryLoading = false
  private summaryList: ISummary[] = []
  private questionBank = questionBank

  private difficulties = difficulties
  private problemSet = problemSet
  private problemType = problemType
  private choices = choices
  private importances = importances
  private statusSet = statusSet

  private languages = languages
  private ansLinkVisible = true
  private ansLinkList: any = []
  private ansLinkMap: any = {}
  private ansLinkForm: any = {
    'language': '',
    'link': ''
  }

  private dateTimeRange: string[] | null = []
  private currentPage = 1
  private pageSizes = ['10000', '10', '20', '50', '100']
  private pageSize = 10000
  private pageCount = 5
  private total = 10
  private listLoading = false
  private ojList: any[] = []
  private filterDifficultiesArray = difficultiesArray
  private filterProblemTypeArray = problemTypeArray
  private filterProblemSetArray = problemSetFilterArray
  private filterStandaloneArray = standaloneFilterArray
  private filterStudyArray = studyFilterArray
  private filterAnsLinkArray = ansLinkFilterArray
  private filterStatusArray = statusFilterArray
  private filterImportanceArray = importanceFilterArray
  private filterHandler = filterHandlerMethod
  private filterEmptyMethod = filterEmptyMethod
  private filterUseTimeArray = useTimeFilterArray
  private filterUseTimeHandler = filterUseTimeHandler

  private calShowTime = calUseTimeOk

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
    for (const t of problemSet) {
      if (ojType === t.value) {
        return t.label
      }
    }
    return ''
  }

  private descImportance = (i: number) => {
    for (const t of importances) {
      if (i === t.value) {
        return t.label
      }
    }
    return ''
  }

  private descStatus = (status: number) => {
    for (const t of statusSet) {
      if (status === t.value) {
        return t.label
      }
    }
    return ''
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
    this.calSummary()
    return result.status
  }

  private descAnsMap (s?: string | undefined) {
    let ansLinks: { language: string; link: string }[] = []
    if (s === undefined || s === '') {
      return ansLinks
    }
    const m = JSON.parse(s)
    for (const l of languages) {
      const link = m[l.label]
      if (link !== undefined && link !== '') {
        ansLinks.push({
          'language': l.label,
          'link': link
        })
      }
    }
    return ansLinks
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
    this.addForm = {
      'difficulty': '中等',
      'ojType': 1,
      'type': '贪心',
      'importance': 1
    }
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
      this.addForm.importance === undefined ||
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
      link: this.addForm.link,
      importance: this.addForm.importance
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
    this.ansLinkList = this.descAnsMap(this.updateForm.ansLink)
    this.ansLinkMap = JSON.parse(this.updateForm.ansLink)
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
      this.timeoutCalSummary()
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
    if (this.oldOj.ansLink !== this.updateForm.ansLink) {
      param.ansLink = this.updateForm.ansLink
    }
    if (this.oldOj.importance !== this.updateForm.importance) {
      param.importance = this.updateForm.importance
    }
    this.updateLoading = true
    const result = await update(param)
    if (result.status) {
      const newOj = result.data
      if (this.checkNeedUpdate(newOj)) {
        this.timeoutCalSummary()
      }
      const oldStatus = this.oldOj.status
      for (const key in newOj) {
        this.oldOj[key] = newOj[key]
      }
      if (newOj.status === 1) {
        this.addTimer(this.oldOj.id, this.oldOj.useTime, this.oldOj.preTime)
      } else {
        if (oldStatus === 1) {
          this.clearTimer()
        }
      }
      this.$message.success('更新成功')
    }
    this.updateLoading = false
    this.updateFormVisible = false
  }

  private checkNeedUpdate (newOj: any) {
    if (newOj.status === undefined && this.oldOj.status !== 3) {
      return false
    }
    if ((newOj.status === 3 && (this.oldOj.status === 1 || this.oldOj.status === 2)) ||
      (this.oldOj.status === 3 && (newOj.status === 1 || newOj.status === 2))) {
      return true
    }
    return (newOj.difficulty !== undefined && newOj.difficulty !== this.oldOj.difficulty) ||
      (newOj.standalone !== undefined && newOj.standalone !== this.oldOj.standalone) ||
      (newOj.study !== undefined && newOj.study !== this.oldOj.study) ||
      (newOj.ansLink !== undefined && newOj.ansLink !== this.oldOj.ansLink)
  }

  private initSummary (difficulty: string) {
    const s: ISummary = {
      difficulty: difficulty,
      cnt0: 0,
      cnt1: 0,
      cnt2: 0,
      cnt3: 0,
      cnt4: 0,
      total: 0,
      percent: 0
    }
    return s
  }

  private calSummary () {
    this.summaryLoading = true
    const easy: ISummary = this.initSummary('简单')
    const medium: ISummary = this.initSummary('中等')
    const hard: ISummary = this.initSummary('困难')
    this.ojList.forEach(oj => {
      if (oj.status === 3 && (this.ojType === 0 || this.ojType === oj.ojType)) {
        if (oj.study === '否') {
          if (oj.difficulty === '简单') {
            easy.cnt2++
          } else if (oj.difficulty === '中等') {
            medium.cnt2++
          } else {
            hard.cnt2++
          }
        }
        if (oj.ansLink === undefined || oj.ansLink === '') {
          if (oj.difficulty === '简单') {
            easy.cnt3++
          } else if (oj.difficulty === '中等') {
            medium.cnt3++
          } else {
            hard.cnt3++
          }
        }
        if (oj.standalone === '是') {
          if (oj.difficulty === '简单') {
            easy.cnt1++
          } else if (oj.difficulty === '中等') {
            medium.cnt1++
          } else {
            hard.cnt1++
          }
        } else {
          if (oj.difficulty === '简单') {
            easy.cnt0++
          } else if (oj.difficulty === '中等') {
            medium.cnt0++
          } else {
            hard.cnt0++
          }
        }
        if (!calUseTimeOk(oj.difficulty, oj.useTime)) {
          if (oj.difficulty === '简单') {
            easy.cnt4++
          } else if (oj.difficulty === '中等') {
            medium.cnt4++
          } else {
            hard.cnt4++
          }
        }
      }
    })
    easy.total = easy.cnt0 + easy.cnt1
    medium.total = medium.cnt0 + medium.cnt1
    hard.total = hard.cnt0 + hard.cnt1
    if (easy.total !== 0) {
      easy.percent = this.calPercent(easy.cnt0, easy.total)
    }
    if (medium.total !== 0) {
      medium.percent = this.calPercent(medium.cnt0, medium.total)
    }
    if (hard.total !== 0) {
      hard.percent = this.calPercent(hard.cnt0, hard.total)
    }
    this.$set(this.summaryList, 0, easy)
    this.$set(this.summaryList, 1, medium)
    this.$set(this.summaryList, 2, hard)
    this.summaryLoading = false
  }

  private calPercent (s: number, m: number) {
    return Math.round(s / m * 10000) / 100
  }

  private timeoutCalSummary () {
    // 延时计算summary， 解决summary表格不更新的bug,怀疑是vue或是elementUI table的bug
    const ts = this.calSummary
    setTimeout(function () {
      ts()
    }, 1000)
  }

  private handleEditAnsLink () {
    // 如果没有提交，重新设置成旧值
    this.ansLinkForm.link = this.ansLinkMap[this.ansLinkForm.language]
    this.ansLinkVisible = false
  }

  private submitAnsLink () {
    this.ansLinkMap[this.ansLinkForm.language] = this.ansLinkForm.link
    this.updateForm.ansLink = JSON.stringify(this.ansLinkMap)
    this.ansLinkList = this.descAnsMap(this.updateForm.ansLink)
    this.ansLinkVisible = true
  }

  private chooseLanguage () {
    this.ansLinkForm.link = this.ansLinkMap[this.ansLinkForm.language]
  }
}
</script>
