<template>
  <div>
    <div>
      <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 10px;">
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <div style="margin-top: 10px;">功能：</div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click.native.prevent="handleAdd">添加任务</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- Form -->
    <el-dialog title="添加任务" :visible.sync="todoFormVisible">
      <el-form :model="todoForm">
        <div v-if="isTodoGroupList">
          <el-form-item label="任务组最大时长" label-width="140px">
            <el-tooltip content="请填写任务组最长工作时间(分钟)" placement="top">
              <el-input v-model="todoForm.maxTime" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="任务组最小优先级" label-width="140px">
            <el-tooltip content="请选择最小优先级(数字越小优先级越高，表示高于此优先级的任务会优先处理)" placement="top">
              <el-select v-model="todoForm.minPriority" placeholder="请选择优先级">
                <el-option v-for="p in todoGroupPriorities" :label="p.label" :value="p.value"
                           :key="p.value"></el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
        </div>
        <el-form-item label="任务内容" label-width="140px">
          <el-tooltip content="请填写任务" placement="top">
            <el-input type="textarea" rows="5" v-model="todoForm.task" autocomplete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="优先级" label-width="140px">
          <el-tooltip content="请选择优先级(数字越小优先级越高,重要且紧急>紧急不重要>重要不紧急>既不重要也不紧急)" placement="top">
            <el-select v-model="todoForm.priority" placeholder="请选择优先级">
              <el-option v-for="p in priorities" :label="p.label" :value="p.value" :key="p.value"></el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <div v-if="!isOpen">
          <el-form-item label="任务价值" label-width="140px">
            <el-tooltip content="请修改任务价值(1-100)" placement="top">
              <el-input v-model="todoForm.value" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="预估时间" label-width="140px">
            <el-tooltip content="请修改任务预估时间(分钟)" placement="top">
              <el-input v-model="todoForm.estimateTime" autocomplete="off"></el-input>
            </el-tooltip>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="todoFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitAdd" :loading="addLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { openAddTodo } from '@/api/open/todo'
import { patchAddTodo } from '@/api/todo'
import { GROUP_ID, TOKEN } from '@/constant/storageConstant'
import { priorities, todoGroupList, todoGroupPriorities, todoList } from '@/constant/todoConstant'
import moment from 'moment'
import { handleTodoList } from '@/utils/todo'

@Component({
  name: 'TodoNav'
})
export default class extends Vue {
  private isTodoGroupList = true
  private isOpen = false
  private isClearAdd = true
  private tokenStr: string | undefined
  private todoFormVisible = false
  private addLoading = false
  private todoForm: any = {}
  private priorities = priorities
  private todoGroupPriorities = todoGroupPriorities

  private handleAdd () {
    const token = localStorage.getItem(TOKEN)
    const groupId = localStorage.getItem(GROUP_ID)
    // 清空
    if (this.isClearAdd) {
      this.todoForm = {}
    }
    if (groupId !== null) {
      this.todoForm.groupId = groupId
    }
    this.isTodoGroupList = this.$route.path === '/todoGroupList'
    if (token !== null) {
      this.isOpen = true
      this.tokenStr = token
    }
    this.todoFormVisible = true
  }

  private checkParam (v: any) {
    if (v === undefined) {
      return false
    }

    if (this.isTodoGroupList) {
      if (v.maxTime === undefined ||
        v.minPriority === undefined) {
        return false
      }
    } else {
      if (v.groupId === undefined) {
        return false
      }
    }

    if (this.isOpen) {
      if (v.task === undefined ||
        v.priority === undefined) {
        return false
      }
    } else {
      if (v.task === undefined ||
        v.value === undefined ||
        v.estimateTime === undefined ||
        v.priority === undefined) {
        return false
      }
    }
    return true
  }

  private changeIsClearAdd (status: any) {
    this.isClearAdd = status
  }

  private async submitAdd () {
    if (!this.checkParam(this.todoForm)) {
      this.$message.error('请填写完任务信息')
      return
    }

    this.addLoading = true
    if (this.isTodoGroupList) {
      const param = {
        maxTime: this.todoForm.maxTime,
        minPriority: this.todoForm.minPriority,
        todoList: [{
          task: this.todoForm.task,
          value: this.todoForm.value,
          estimateTime: this.todoForm.estimateTime,
          priority: this.todoForm.priority
        }]
      }
      const result = await patchAddTodo(param)
      this.changeIsClearAdd(result.status)
      if (result.status) {
        const t = result.data
        const todoGroup = {
          id: t.id,
          createTime: t.createTime,
          totalValue: t.value,
          finishValue: t.finishValue,
          totalTime: t.totalTime,
          maxTime: t.maxTime,
          minPriority: t.minPriority,
          updateDateTime: moment(t.updateTime).format('YYYY-MM-DD HH:mm:ss'),
          status: t.status
        }
        todoGroupList.unshift(todoGroup)
        this.$message.success('添加成功')
      }
    } else {
      if (this.isOpen) {
        if (this.tokenStr === undefined) {
          this.$message.error('你无权操作')
          return
        }
        const result = await openAddTodo(this.tokenStr, {
          task: this.todoForm.task,
          priority: this.todoForm.priority
        })
        if (result.status) {
          this.$message.success('添加成功')
        }
        this.changeIsClearAdd(result.status)
        handleTodoList(result, todoList, true)
      } else {
        const param = {
          groupId: this.todoForm.groupId,
          maxTime: this.todoForm.maxTime,
          minPriority: this.todoForm.minPriority,
          todoList: [{
            task: this.todoForm.task,
            value: this.todoForm.value,
            estimateTime: this.todoForm.estimateTime,
            priority: this.todoForm.priority
          }]
        }
        const result = await patchAddTodo(param)
        if (result.status) {
          this.$message.success('添加成功')
        }
        this.changeIsClearAdd(result.status)
        handleTodoList(result, todoList, true)
      }
    }

    this.todoFormVisible = false
    this.addLoading = false
  }
}
</script>
