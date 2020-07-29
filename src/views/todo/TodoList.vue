<template>
  <div>
    <Nav></Nav>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      max-height="600"
      style="width: 100%;">
      <el-table-column
        fixed="left"
        align="center"
        prop="createDate"
        label="创建日期">
      </el-table-column>
      <el-table-column
        align="center"
        prop="simpleTask"
        label="任务">
      </el-table-column>
      <el-table-column
        align="center"
        prop="value"
        label="价值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="estimateTime"
        label="预估时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTimeDate"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="priority"
        label="优先级">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="状态">
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
  private listLoading = true
  private dataMap: Map<string, Array<ITodo>> = new Map<string, Array<ITodo>>()

  private async handleEdit () {

  }

  private async getTodoList (status: string) {
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
          let todo: ITodo = {
            id: v.id,
            groupId: v.groupId,
            createDate: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
            simpleTask: v.task.substr(0, 3),
            task: v.task,
            value: v.value,
            estimateTime: v.estimateTime,
            updateDateTime: moment(v.updateTime).format("YYYY-MM-DD HH:mm:ss"),
            priority: this.descPriority(v.priority),
            status: this.descStatus(v.status)
          }
          t.push(todo)
        })
      }
      let processingTodoList = this.dataMap.get(status) || []
      for (let t of processingTodoList) {
        this.tableData.push(t)
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
      return '紧急不重要-'.concat(priority.toString())
    } else if (priority >= 7 && priority <= 9) {
      return '重要不紧急-'.concat(priority.toString())
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

  mounted () {
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      this.$router.push({
        path: '/login'
      })
    } else {
      // 已登录，加载初始数据
      this.getTodoList('20')
    }
  }
}
</script>
