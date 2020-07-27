<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#30B08F" text-color="#f4f4f5">
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2" style="position:absolute;right:0;" @click.native.prevent="handleLogout">退出</el-menu-item>
    </el-menu>
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
        prop="totalValue"
        label="总价值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalTime"
        label="总用时（分钟）">
      </el-table-column>
      <el-table-column
        align="center"
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
        prop="updateDateTime"
        label="最后更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
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
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { listTodoGroup } from "@/api/todo";
import moment from 'moment'
import { ITodoGroup } from "@/api/types";

@Component({
  name: 'Home'
})
export default class extends Vue {
  private tableData: ITodoGroup[] = []
  private listLoading = true

  private descStatus (status: number) {
    return status === 1 ? '进行中' : status === 50 ? '已删除' : '已完成'
  }

  private async handleDetails(row: any) {
    localStorage.setItem("groupId", row.id)
    await this.$router.push({
      path: '/todoList'
    })
  }

  private async handleEdit() {

  }

  private async getTodoGroupList () {
    this.listLoading = true
    let param = {
      offset: 0,
      count: 100,
      // timeMillis: moment().unix() * 1000,
      sort: 'asc',
    }
    const result = await listTodoGroup(param)
    if (result.status) {
      for (let t of result.data) {
        const todoGroup = {
          'id': t.id,
          'createDate': moment(t.createTime).format("YYYY-MM-DD HH:mm:ss"),
          'totalValue': t.value,
          'totalTime': t.totalTime,
          'maxTime': t.maxTime,
          'minPriority': t.minPriority,
          'updateDateTime': moment(t.updateTime).format("YYYY-MM-DD HH:mm:ss"),
          'status': t.status
        }
        console.log(todoGroup)
        this.tableData.push(todoGroup)
      }
    }
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
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
      this.getTodoGroupList()
    }
  }

  private async handleLogout () {
    const status = await UserModule.Logout()
    if (status) {
      await this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
