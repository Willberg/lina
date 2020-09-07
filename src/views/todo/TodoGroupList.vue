<template>
  <div>
    <Nav></Nav>
    <TodoNav></TodoNav>
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
        <el-select v-model="status" placeholder="请选择任务组状态">
          <el-option v-for="s in todoGroupStatusGroup" :key="s.value" :label="s.label" :value="s.value"></el-option>
        </el-select>
      </el-col>
      <el-col :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
        <el-button type="primary" @click="searchList">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="todoGroupList"
      :default-sort="{prop: 'createTime', order: 'descending'}"
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
        width="160"
        fixed="left"
        align="center"
        prop="createTime"
        label="创建日期">
        <template slot-scope="scope">
          {{descCreateTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalValue"
        label="总价值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="finishValue"
        label="完成价值">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="totalTime"
        label="总用时（分钟）">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        prop="maxTime"
        label="最大用时（分钟）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="minPriority"
        label="最小优先级">
      </el-table-column>
      <el-table-column
        align="center"
        width="160"
        prop="updateDateTime"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        :filters="filterArray"
        :filter-method="filterHandler"
        label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'info' : scope.row.status === 50? 'danger': 'success'"
            disable-transitions>{{descStatus(scope.row.status)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDetails(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleShare(scope.row)" type="text" size="small">分享</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog title="修改任务组信息" :visible.sync="todoGroupFormVisible">
      <el-form :model="todoGroupForm">
        <el-form-item label="最大时长" label-width="120px">
          <el-tooltip content="请填写任务组最长工作时间(分钟)" placement="top">
            <el-input v-model="todoGroupForm.maxTime" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="最小优先级" label-width="120px">
          <el-tooltip content="请选择优先级(数字越小优先级越高，表示高于此优先级的任务会优先处理)" placement="top">
            <el-select v-model="todoGroupForm.minPriority" placeholder="请选择优先级">
              <el-option v-for="p in priorities" :label="p.label" :value="p.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="todoGroupFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分享url" :visible.sync="shareUrlVisible">
      <el-link type="primary">{{shareUrl}}</el-link>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="shareUrl" @click="shareUrlVisible=false">拷 贝</el-button>
        <el-button @click="shareUrlVisible=false">取 消</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { countTodoGroup, listTodoGroup, updateTodoGroup } from "@/api/todo"
import moment from 'moment'
import { ITodoGroup } from '@/types/todo/types'
import Nav from '@/components/navbar/index.vue'
import { createUrl, getUser } from '@/api/user'
import { todoGroupFilterArray, todoGroupList, todoGroupPriorities, todoGroupStatusGroup } from '@/constant/todoConstant'
import { GROUP_ID, MAX_TIME, NAV_INDEX } from '@/constant/storageConstant'
import TodoNav from '@/views/todo/component/TodoNav.vue'
import { cvtTimeMillisByDateTimeStr, startDateTimeStr } from '@/utils/time'
import { filterHandlerMethod } from '@/utils/table'

@Component({
  name: 'TodoGroupList',
  components: {
    Nav,
    TodoNav
  }
})
export default class extends Vue {
  private todoGroupList: ITodoGroup[] = todoGroupList
  private listLoading = true
  private editLoading = false
  private shareUrlVisible = false
  private shareUrl = ''
  private todoGroupFormVisible = false
  private todoGroupForm: any = {}
  private pendingTodoGroup: ITodoGroup | undefined
  private priorities = todoGroupPriorities

  private currentPage = 1
  private pageSizes = ['10', '20', '50', '100']
  private pageSize = 10
  private pageCount = 5
  private total = 10
  private todoGroupStatusGroup = todoGroupStatusGroup
  private dateTimeRange: string[] | null = []
  private status = 0
  private filterArray = todoGroupFilterArray
  private filterHandler = filterHandlerMethod

  mounted () {
    this.dateTimeRange = [
      startDateTimeStr(moment()),
      startDateTimeStr(moment().add(1, 'days'))
    ]

    console.log(1)
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      this.getUserAndInitData()
    } else {
      this.initData()
    }
  }

  private async initData () {
    // 已登录，加载初始数据
    const status = await this.getTodoGroupList()
    if (status) {
      // 获取数据总量
      await this.getTodoGroupTotal()
    }
  }

  private async getUserAndInitData () {
    const result = await getUser()
    if (result.status) {
      UserModule.setUser(result.data)
      await this.initData()
    }
  }

  private async getTodoGroupTotal () {
    const startTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[0]) : undefined
    const endTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[1]) : undefined
    const param = {
      startTime: startTime,
      endTime: endTime,
      status: this.status
    }
    const result = await countTodoGroup(param)
    if (result.status) {
      this.total = result.data
    }
  }

  private handleSizeChange (val: number) {
    this.pageSize = val
  }

  private handleCurrentChange (val: number) {
    this.currentPage = val
    this.getTodoGroupList()
  }

  private descCreateTime (createTime: number) {
    return moment(createTime).format("YYYY-MM-DD HH:mm:ss")
  }

  private descStatus (status: number) {
    return status === 1 ? '进行中' : status === 50 ? '已删除' : '已完成'
  }

  private async handleDetails (row: any) {
    localStorage.setItem(GROUP_ID, row.id)
    localStorage.setItem(MAX_TIME, row.maxTime)
    localStorage.setItem(NAV_INDEX, '0')
    await this.$router.push({
      path: '/todoList'
    })
  }

  private handleEdit (todoGroup: ITodoGroup) {
    this.todoGroupForm = {
      id: todoGroup.id,
      maxTime: todoGroup.maxTime,
      minPriority: todoGroup.minPriority
    }
    this.pendingTodoGroup = todoGroup
    this.todoGroupFormVisible = true
  }

  private async submitEdit () {
    this.editLoading = true
    if (this.pendingTodoGroup !== undefined
      && (this.pendingTodoGroup.maxTime !== this.todoGroupForm.maxTime
        || this.pendingTodoGroup.minPriority !== this.todoGroupForm.minPriority)) {
      const param = {
        id: this.todoGroupForm.id,
        maxTime: undefined,
        minPriority: undefined
      }
      if (this.pendingTodoGroup.maxTime !== this.todoGroupForm.maxTime) {
        param.maxTime = this.todoGroupForm.maxTime
      }
      if (this.pendingTodoGroup.minPriority !== this.todoGroupForm.minPriority) {
        param.minPriority = this.todoGroupForm.minPriority
      }
      const result = await updateTodoGroup(param)
      if (result.status) {
        if (param.maxTime !== undefined) {
          this.pendingTodoGroup.maxTime = result.data.maxTime
        }
        if (param.minPriority !== undefined) {
          this.pendingTodoGroup.minPriority = result.data.minPriority
        }

        this.$message.success('修改成功')
      }
    }
    this.todoGroupFormVisible = false
    this.editLoading = false
  }

  private async handleShare (todoGroup: ITodoGroup) {
    this.shareUrlVisible = true
    const param = {
      url: location.protocol + '//' + location.host + '/#/todoList',
      groupId: todoGroup.id
    }
    const result = await createUrl(param)
    if (result.status) {
      this.shareUrl = result.data
    }
  }

  private async getTodoGroupList () {
    this.listLoading = true
    const startTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[0]) : undefined
    const endTime = this.dateTimeRange !== null ? cvtTimeMillisByDateTimeStr(this.dateTimeRange[1]) : undefined
    const param = {
      offset: (this.currentPage - 1) * this.pageSize,
      count: this.pageSize,
      startTime: startTime,
      endTime: endTime,
      status: this.status,
      sort: 'desc',
    }
    const result = await listTodoGroup(param)
    // 拉取数据时要清空原来的数据
    this.todoGroupList.splice(0, this.todoGroupList.length)
    if (result.status) {
      for (let t of result.data) {
        const todoGroup = {
          id: t.id,
          createTime: t.createTime,
          totalValue: t.value,
          finishValue: t.finishValue,
          totalTime: t.totalTime,
          maxTime: t.maxTime,
          minPriority: t.minPriority,
          updateDateTime: moment(t.updateTime).format("YYYY-MM-DD HH:mm:ss"),
          status: t.status
        }
        this.todoGroupList.push(todoGroup)
      }
    }
    this.listLoading = false
    return result.status
  }

  private searchList () {
    this.getTodoGroupList()
    this.getTodoGroupTotal()
  }
}
</script>
