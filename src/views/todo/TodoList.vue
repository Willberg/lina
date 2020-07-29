<template>
  <div>
    <Nav></Nav>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      :default-sort="{prop: 'cp', order: 'descending'}"
      border
      fit
      highlight-current-row
      max-height="600"
      style="width: 100%;">
      <el-table-column
        fixed="left"
        align="center"
        prop="createDate"
        width="160"
        label="创建日期">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        :filters="filterArray"
        :filter-method="filterHandler"
        label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'info' :
            scope.row.status === 10 ? 'primary' :
            scope.row.status === 20 ? 'warning' :
             scope.row.status === 50? 'danger':
              'success'"
                  disable-transitions>{{descStatus(scope.row.status)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="task"
        label="任务">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.task }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.task.substr(0, 5) }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cp"
        :sort-method="sortStatusCp"
        label="性价比">
        <template slot-scope="scope">{{scope.row.cp}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="value"
        label="价值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="estimateTime"
        label="预估时间（分钟）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="realityTime"
        label="实际用时（分钟）">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateDateTime"
        width="160"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="priority"
        label="优先级">
        <template slot-scope="scope">
          <el-tag :type="descPriority(scope.row.priority).startsWith('重要且紧急') ? 'danger' :
            descPriority(scope.row.priority).startsWith('紧急不重要') ? 'warning' :
            descPriority(scope.row.priority).startsWith('重要不紧急') ? 'success' :
              'info'"
                  disable-transitions>{{descPriority(scope.row.priority)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Nav from "@/components/navbar/index.vue";
import { IRetTodo, ITodo } from "@/api/types";
import { listTodo } from "@/api/todo";
import moment from "moment";
import { UserModule } from "@/store/modules/user";

@Component({
  name: 'TodoList',
  components: {
    Nav
  }
})
export default class extends Vue {
  private tableData: ITodo[] = []
  private statusArray = ['1', '10', '20', '50', '100']
  private filterArray = [
    { text: '初始', value: '1' },
    { text: '等待', value: '10' },
    { text: '处理中', value: '20' },
    { text: '删除', value: '50' },
    { text: '完成', value: '100' }
  ]
  private listLoading = true
  private dataMap: Map<string, Array<ITodo>> = new Map<string, Array<ITodo>>()

  mounted () {
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      this.$router.push({
        path: '/login'
      })
    } else {
      // 已登录，加载初始数据
      this.getTodoList()
    }
  }

  private async handleEdit () {

  }

  private async getTodoList (status?: string) {
    this.listLoading = true
    let param = {
      groupId: parseInt(localStorage.getItem('groupId') || '0')
    }
    const result = await listTodo(param)
    if (result.status) {
      for (let k of Object.keys(result.data)) {
        result.data[k].forEach((v: IRetTodo) => {
          let t = this.dataMap.get(k)
          if (!t) {
            t = new Array<ITodo>()
            this.dataMap.set(k, t)
          }
          let cp = ((v.value || 100) / (v.estimateTime || 1)).toFixed(4)
          if (k === '100') {
            cp = (v.value / v.realityTime).toFixed(4)
          }
          let todo: ITodo = {
            id: v.id,
            groupId: v.groupId,
            cp: cp,
            createDate: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
            task: v.task,
            value: v.value,
            estimateTime: v.estimateTime,
            realityTime: v.realityTime,
            updateDateTime: moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss"),
            priority: v.priority,
            status: v.status
          }
          t.push(todo)
        })
      }
      if (!status) {
        for (let s of this.statusArray) {
          let processingTodoList = this.dataMap.get(s) || []
          for (let t of processingTodoList) {
            this.tableData.push(t)
          }
        }
      } else {
        let processingTodoList = this.dataMap.get(status) || []
        for (let t of processingTodoList) {
          this.tableData.push(t)
        }
      }

    }
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private descPriority (priority: number) {
    if (priority >= 1 && priority <= 3) {
      return '重要且紧急-'.concat(priority.toString())
    } else if (priority >= 4 && priority <= 6) {
      return '紧急不重要-'.concat((priority - 3).toString())
    } else if (priority >= 7 && priority <= 9) {
      return '重要不紧急-'.concat((priority - 6).toString())
    } else {
      return '既不重要也不紧急'
    }
  }

  private descStatus (status: number) {
    if (status == 1) {
      return '初始'
    } else if (status == 10) {
      return '等待'
    } else if (status == 20) {
      return '处理中'
    } else if (status == 50) {
      return '已删除'
    } else {
      return '已完成'
    }
  }

  private filterHandler (value: string, row: any, column: any) {
    const property = column['property']
    return row[property] == value
  }

  private changeStatusForSort (s: number) {
    // 1>20>10>100>50
    if (s == 1) {
      return 5
    } else if (s == 10) {
      return 3
    } else if (s == 20) {
      return 4
    } else if (s == 50) {
      return 1
    } else {
      return 2
    }
  }

  private sortStatusCp (a: ITodo, b: ITodo) {
    const aStatus = this.changeStatusForSort(a.status)
    const bStatus = this.changeStatusForSort(b.status)
    if (aStatus > bStatus) {
      return 1
    } else if (aStatus < bStatus) {
      return -1
    } else {
      const aCp = a.cp
      const bCp = b.cp
      return aCp > bCp ? 1 : -1
    }
  }
}
</script>
