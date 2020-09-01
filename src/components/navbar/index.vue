<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#000000"
             background-color="#30B08F" text-color="#f4f4f5" @select="handleSelect">
      <el-menu-item index="1" @click.native.prevent="handleRedirect('/')">首页</el-menu-item>
      <el-menu-item index="2" @click.native.prevent="handleRedirect('/todoGroupList')">待办</el-menu-item>
      <el-menu-item index="3" @click.native.prevent="handleRedirect('/tool')">常用工具</el-menu-item>
      <el-menu-item v-if="!isLogin" index="12" style="position:absolute;right:0;"
                    @click.native.prevent="handleRedirect('/login')">登陆
      </el-menu-item>
      <!--      <el-menu-item v-if="isLogin" index="12" style="position:absolute;right:0;" @click.native.prevent="handleLogout">-->
      <!--        退出-->
      <!--      </el-menu-item>-->
      <el-submenu v-if="isLogin" index="12" style="position:absolute;right:0;">
        <template slot="title">个人中心</template>
        <el-menu-item index="12-1" @click.native.prevent="editPasswordVisible=true">修改密码</el-menu-item>
        <el-menu-item index="12-2" @click.native.prevent="handleLogout">退出</el-menu-item>
      </el-submenu>
    </el-menu>
    <div v-if="isTodo">
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

    <!-- Form -->
    <el-dialog title="添加任务" :visible.sync="editPasswordVisible">
      <el-form :model="updatePassword">
        <el-form-item label="原密码" label-width="140px">
          <el-input v-model="updatePassword.oldPassword" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="140px">
          <el-input v-model="updatePassword.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPasswordVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpdatePassword" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { openAddTodo } from '@/api/open/todo'
import { patchAddTodo } from '@/api/todo'
import { priorities, todoGroupList, todoGroupPriorities, todoList } from '@/constant/todoConstant'
import { GROUP_ID, NAV_INDEX, TOKEN } from '@/constant/storageConstant'
import moment from 'moment'
import { handleTodoList } from '@/utils/todo'
import { getUser, updatePassword } from '@/api/user'
import md5 from 'js-md5'
import { isValidPassword } from "@/utils/validate";

@Component({
  name: 'Nav'
})
export default class extends Vue {
  private isLogin = UserModule.userProfile !== undefined
  private isTodo = false
  private isTodoGroupList = true
  private isOpen = false
  private isClearAdd = true
  private tokenStr: string | undefined
  private todoFormVisible = false
  private addLoading = false
  private todoForm: any = {}
  private priorities = priorities
  private todoGroupPriorities = todoGroupPriorities
  private activeIndex = '1'

  private editPasswordVisible = false
  private editLoading = false
  private updatePassword = {
    oldPassword: '',
    newPassword: ''
  }

  created () {
    this.activeIndex = sessionStorage.getItem(NAV_INDEX) || '1'
    this.isTodo = this.$route.path.startsWith('/todo')
  }

  mounted () {
    const user = UserModule.userProfile
    if (user === undefined) {
      if (location.hash === '#/') {
        // 首页时进行用户资料查询
        this.getUserAndSetUser()
      }
    }
  }

  private async getUserAndSetUser () {
    const result = await getUser()
    if (result.status) {
      this.isLogin = true
      UserModule.setUser(result.data)
    }
  }

  private async handleRedirect (page: string) {
    await this.$router.push({
      path: page
    })
  }

  private handleSelect (key: string) {
    if (key !== '12') {
      sessionStorage.setItem(NAV_INDEX, key)
    }
  }

  private async handleLogout () {
    const status = await UserModule.Logout()
    if (status) {
      UserModule.setUser(undefined)
      this.isLogin = false
      if (location.hash !== '#/') {
        await this.$router.push({
          path: '/'
        })
      }
    }
    if (location.hash === '#/') {
      // 首页退出，刷新首页，隐藏要登录的功能
      location.reload()
    }
  }

  private handleAdd () {
    const token = sessionStorage.getItem(TOKEN)
    const groupId = sessionStorage.getItem(GROUP_ID)
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

  private async submitUpdatePassword () {
    if (this.updatePassword.oldPassword === ''
      || this.updatePassword.newPassword === ''
      || this.updatePassword.oldPassword === this.updatePassword.newPassword) {
      this.$message.error('请完善信息')
      return
    }

    if (!isValidPassword(this.updatePassword.newPassword)) {
      this.$message.error('请填写正确的密码，必须包含6位以上，并且含大写字母，小写字母，数字，特殊符号中的三种及以上')
      return
    }

    this.editLoading = true
    const param = {
      oldPassword: md5(this.updatePassword.oldPassword),
      newPassword: md5(this.updatePassword.newPassword)
    }
    const result = await updatePassword(param)
    if (result.status) {
      this.$message.success('修改成功')
    }
    this.updatePassword = {
      oldPassword: '',
      newPassword: ''
    }
    this.editLoading = false
    this.editPasswordVisible = false
  }
}
</script>
