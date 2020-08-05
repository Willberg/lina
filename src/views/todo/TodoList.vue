<template>
  <div>
    <Nav></Nav>
    <el-table
      v-loading="listLoading"
      :data="todoList"
      :default-sort="{prop: 'cp', order: 'descending'}"
      border
      fit
      highlight-current-row
      max-height="600"
      style="width: 100%;">
      <el-table-column
        fixed="left"
        align="center"
        prop="id"
        width="160"
        label="ID">
      </el-table-column>
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
        width="160"
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
          <el-button :disabled="disableEditButton(scope.row.status)" @click="handleEdit(scope.row)"
                     type="text" size="small">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog title="修改任务信息" :visible.sync="todoFormVisible">
      <el-form :model="todoForm">
        <el-form-item label="任务内容" label-width="120px">
          <el-tooltip content="请修改任务" placement="top">
            <el-input v-model="todoForm.task" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="优先级" label-width="120px">
          <el-tooltip content="请选择优先级(数字越小优先级越高,重要且紧急>紧急不重要>重要不紧急>既不重要也不紧急)" placement="top">
            <el-select v-model="todoForm.priority" placeholder="请选择优先级">
              <el-option v-for="p in priorities" :key="p.value" :label="p.label" :value="p.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <div v-if="!isOpen">
          <el-form-item label="任务价值" label-width="120px">
            <el-tooltip content="请修改任务价值(1-100)" placement="top">
              <el-input v-model="todoForm.value" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="预估时间" label-width="120px">
            <el-tooltip content="请修改任务预估时间(分钟)" placement="top">
              <el-input v-model="todoForm.estimateTime" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="实际时间" label-width="120px">
            <el-tooltip content="请修改任务实际时间(分钟)" placement="top">
              <el-input v-model="todoForm.realityTime" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="任务状态" label-width="120px">
            <el-tooltip content="请选择任务状态" placement="top">
              <el-select v-model="todoForm.status" placeholder="请选择任务状态">
                <el-option v-for="s in statusGroup" :key="s.value" :label="s.label" :value="s.value"></el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="todoFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitEdit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import Nav from "@/components/navbar/index.vue"
import { ITodo } from "@/types/todo/types"
import { listTodo, updateTodo } from "@/api/todo"
import { UserModule } from "@/store/modules/user"
import { openListTodo, openUpdateTodo } from "@/api/open/todo"
import { filterArray, priorities, statusGroup, todoList } from '@/constant/todoConstant'
import { GROUP_ID, TOKEN } from "@/constant/storageConstant"
import { handleTodoList, convertToTodo } from "@/utils/todo"
import { openFreshToken } from "@/api/open/token";

@Component({
  name: 'TodoList',
  components: {
    Nav
  }
})
export default class extends Vue {
  private todoList: ITodo[] = todoList
  private filterArray = filterArray
  private listLoading = true

  private isOpen = false
  private todoFormVisible = false
  private editLoading = false
  private todoForm: any = {}
  private oldTodo: ITodo | undefined
  private statusGroup = statusGroup
  private priorities = priorities
  private refreshTokenTimer: any

  // 不在mounted里添加setInterval,否则会一直循环，无法加载完数据
  created () {
    this.refreshTokenTimer = setInterval(async function () {
      const token = sessionStorage.getItem(TOKEN)
      if (token !== null) {
        const result = await openFreshToken(token)
        if (result.status) {
          // 刷新token
          sessionStorage.setItem(TOKEN, result.data)
        }
      }
    }, 600000)
  }

  mounted () {
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      const token = this.$route.query.token
      if ('string' !== typeof token) {
        this.$router.push({
          path: '/login'
        })
        return
      }
      const tokenStr = token.toString()
      if (/^(\w|-)+\.(\w|-)+\.(\w|-)+$/.test(tokenStr)) {
        // jwt获取数据
        this.getOpenTodoList(tokenStr)
      } else {
        this.$router.push({
          path: '/login'
        })
      }
    } else {
      // 已登录，加载初始数据
      this.getTodoList()
    }
  }

  beforeDestroy () {
    // 清除定时刷新，不清除会一直运行，关闭页面也会定时刷新
    const token = sessionStorage.getItem(TOKEN)
    if (token !== null) {
      sessionStorage.clear()
    }
    clearInterval(this.refreshTokenTimer);
  }

  private disableEditButton (status: number) {
    return this.isOpen && status != 1 && status != 10
  }

  private handleEdit (todo: ITodo) {
    this.oldTodo = todo
    this.todoForm = {
      id: todo.id,
      task: todo.task,
      priority: todo.priority,
      value: todo.value,
      estimateTime: todo.estimateTime,
      realityTime: todo.realityTime,
      status: todo.status
    }
    this.todoFormVisible = true
  }

  private async submitEdit () {
    if (this.oldTodo !== undefined
      && (this.oldTodo.task !== this.todoForm.task
        || this.oldTodo.priority !== this.todoForm.priority
        || this.oldTodo.value !== this.todoForm.value
        || this.oldTodo.estimateTime !== this.todoForm.estimateTime
        || this.oldTodo.realityTime !== this.todoForm.realityTime
        || this.oldTodo.status !== this.todoForm.status)) {
      if (this.isOpen) {
        const token = sessionStorage.getItem(TOKEN)
        if (token === null) {
          this.$message.error('你无权操作')
          return
        }
        const param = {
          id: this.todoForm.id,
          task: undefined,
          priority: undefined
        }
        if (this.oldTodo.task !== this.todoForm.task) {
          param.task = this.todoForm.task
        }
        if (this.oldTodo.priority !== this.todoForm.priority) {
          param.priority = this.todoForm.priority
        }
        const result = await openUpdateTodo(token, param)
        if (result.status) {
          const idx = this.todoList.indexOf(this.oldTodo)
          this.todoList.splice(idx, 1)
          this.todoList.push(convertToTodo(result.data))
        }
      } else {
        const param = {
          id: this.todoForm.id,
          task: undefined,
          priority: undefined,
          value: undefined,
          estimateTime: undefined,
          realityTime: undefined,
          status: undefined
        }

        if (this.oldTodo.task !== this.todoForm.task) {
          param.task = this.todoForm.task
        }
        if (this.oldTodo.value !== this.todoForm.value) {
          param.value = this.todoForm.value
        }
        if (this.oldTodo.priority !== this.todoForm.priority) {
          param.priority = this.todoForm.priority
        }
        if (this.oldTodo.estimateTime !== this.todoForm.estimateTime) {
          param.estimateTime = this.todoForm.estimateTime
        }
        if (this.oldTodo.realityTime !== this.todoForm.realityTime) {
          param.realityTime = this.todoForm.realityTime
        }
        if (this.oldTodo.status !== this.todoForm.status) {
          param.status = this.todoForm.status
        }
        if (param.priority !== undefined || param.estimateTime !== undefined || param.value !== undefined) {
          if (this.todoForm.status != 10) {
            this.$message.error('必须改为等待状态，进行动态规划')
            return
          }
          param.status = this.todoForm.status
        }
        if (param.realityTime !== undefined) {
          if (this.todoForm.status != 100) {
            this.$message.error('必须改为完成状态，才能设置完成时间')
            return
          }
          param.status = this.todoForm.status
        }
        const result = await updateTodo(param)
        if (result.status) {
          const idx = this.todoList.indexOf(this.oldTodo)
          this.todoList.splice(idx, 1)
          this.todoList.push(convertToTodo(result.data))
        }
      }
    }
    this.todoFormVisible = false
    this.editLoading = false
  }

  private async getOpenTodoList (token: string) {
    this.listLoading = true
    const result = await openListTodo(token)
    if (result.status) {
      this.isOpen = true
      // openAdd使用
      sessionStorage.setItem(TOKEN, token)
    }
    handleTodoList(result, this.todoList)
    this.listLoading = false
  }

  private async getTodoList () {
    this.listLoading = true
    let param = {
      groupId: parseInt(sessionStorage.getItem(GROUP_ID) || '0')
    }
    const result = await listTodo(param)
    if (result.status) {
      this.isOpen = false
    }
    handleTodoList(result, this.todoList)
    this.listLoading = false
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
      const aCp = parseFloat(a.cp)
      const bCp = parseFloat(b.cp)
      return aCp > bCp ? 1 : -1
    }
  }
}
</script>
