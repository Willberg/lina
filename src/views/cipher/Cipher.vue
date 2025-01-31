<template>
  <div>
    <Nav></Nav>
    <el-row :gutter="24">
      <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6" style="margin-top: 10px;">
        <el-input v-model="searchName" placeholder="请输入网站名"></el-input>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="6" :xl="6">
        <el-row :gutter="24" style="margin-top: 10px;">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button type="primary" @click="searchByName">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button type="primary" @click="showDialog(true)">添加</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="cipherList"
      :default-sort="{prop: 'id', order: 'descending'}"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%; margin-top: 20px;">
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
        prop="name"
        label="网站名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userName"
        label="用户名">
      </el-table-column>
      <el-table-column
        align="center"
        prop="password"
        label="密码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phoneNumber"
        label="手机号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateDateTime"
        label="更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'danger'"
            disable-transitions>{{descStatus(scope.row.status)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-clipboard:copy="scope.row.password">密码</el-button>
          <el-button @click="showDialog(false, scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleRedirect(scope.row)" type="text" size="small">跳转</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="isShowDialog">
      <el-form :model="cipher">
        <el-form-item label="网站名" label-width="120px">
          <el-input v-model="cipher.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="cipher.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="!isAdd" label="修改密码" label-width="120px">
          <el-switch style="margin-left: 20px;" v-model="isChangePassword" active-color="#13ce66"
                     inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="cipher.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="cipher.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录链接" label-width="120px">
          <el-input v-model="cipher.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="!isAdd" label="创建时间" label-width="120px">
          {{descCreateTime(cipher.createTime)}}
        </el-form-item>
        <el-form-item v-show="!isAdd" label="更新时间" label-width="120px">
          {{cipher.updateDateTime}}
        </el-form-item>
        <el-form-item v-show="!isAdd" label="状态" label-width="120px">
          <el-select v-model="cipher.status" placeholder="请选择状态">
            <el-option v-for="s in statusMap" :label="s.label" :value="s.value" :key="s.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog=false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!--  跳转  -->
    <el-dialog title="跳转url" :visible.sync="redirectUrlVisible">
      <el-link :herf="redirectUrl" type="primary" target="_blank">{{redirectUrl}}</el-link>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="redirectUrl" @click="redirectUrlVisible=false">拷 贝</el-button>
        <el-button @click="redirectUrlVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
import { ICipher } from '@/types/cipher/types'
import { statusMap } from '@/constant/cipherConstant'
import { apiAddCipher, apiSearchCipher, apiUpdateCipher } from '@/api/cipher'
import Nav from '@/components/navbar/index.vue'
import { getUser } from "@/api/user";

@Component({
  name: 'Cipher',
  components: {
    Nav
  }
})
export default class extends Vue {
  private searchName = ''
  private listLoading = false
  private cipherList: ICipher[] = []

  private redirectUrlVisible = false
  private redirectUrl = ''

  private isShowDialog = false
  private submitLoading = false
  private isChangePassword = false
  private isAdd = true
  private dialogTitle = '添加密码'
  private statusMap = statusMap
  private oldCipher: ICipher | undefined
  private cipher: ICipher = {
    id: 0,
    createTime: 0,
    name: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    link: '',
    updateDateTime: '',
    status: 1
  }

  private descCreateTime (createTime: number) {
    return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
  }

  private descStatus (status: number) {
    return status === 1 ? '正常' : '删除'
  }
  mounted () {
      this.searchByName()
  }

  private async searchByName () {
    this.listLoading = true
    const param = {
      name: this.searchName
    }
    const result = await apiSearchCipher(param)
    if (result.status) {
      this.cipherList = []
      for (const c of result.data) {
        const cipher: ICipher = {
          id: c.id,
          createTime: c.createTime,
          name: c.name,
          userName: c.userName,
          password: c.password,
          email: c.email,
          phoneNumber: c.phoneNumber,
          link: c.link,
          updateDateTime: moment(c.updateTime).format('YYYY-MM-DD HH:mm:ss'),
          status: c.status
        }
        this.cipherList.push(cipher)
      }
    }
    this.listLoading = false
  }

  private showDialog (isAdd: boolean, c?: ICipher) {
    this.isShowDialog = true
    this.isAdd = isAdd
    if (this.isAdd) {
      this.dialogTitle = '添加网站密码'
    } else {
      if (c !== undefined) {
        this.cipher = c
        // 深拷贝，不能拷贝function
        this.oldCipher = JSON.parse(JSON.stringify(c))
      }
      this.isChangePassword = false
      this.dialogTitle = '修改网站密码'
    }
  }

  private handleRedirect (cipher: ICipher) {
    this.redirectUrlVisible = true
    this.redirectUrl = cipher.link
  }

  private async submit () {
    this.submitLoading = true
    if (this.isAdd) {
      const param = {
        name: this.cipher.name,
        userName: this.cipher.userName !== '' ? this.cipher.userName : undefined,
        email: this.cipher.email !== '' ? this.cipher.email : undefined,
        phoneNumber: this.cipher.phoneNumber !== '' ? this.cipher.phoneNumber : undefined,
        link: this.cipher.link
      }
      const result = await apiAddCipher(param)
      if (result.status) {
        const c = result.data
        const cipher: ICipher = {
          id: c.id,
          createTime: c.createTime,
          name: c.name,
          userName: c.userName,
          password: c.password,
          email: c.email,
          phoneNumber: c.phoneNumber,
          link: c.link,
          updateDateTime: moment(c.updateTime).format('YYYY-MM-DD HH:mm:ss'),
          status: c.status
        }
        this.cipherList.push(cipher)
        this.$message.success('添加成功')
      }
    } else {
      if (this.oldCipher === undefined ||
        (this.oldCipher.name === this.cipher.name &&
          this.oldCipher.userName === this.cipher.userName &&
          !this.isChangePassword &&
          this.oldCipher.email === this.cipher.email &&
          this.oldCipher.phoneNumber === this.cipher.phoneNumber &&
          this.oldCipher.link === this.cipher.link &&
          this.oldCipher.status === this.cipher.status)) {
        this.$message.warning('请修改内容')
        this.isShowDialog = false
        this.submitLoading = false
        return
      }

      const param = {
        id: this.cipher.id,
        name: this.cipher.name !== this.oldCipher.name ? this.cipher.name : undefined,
        userName: this.cipher.userName !== this.oldCipher.userName ? this.cipher.userName : undefined,
        password: this.isChangePassword ? '1' : undefined,
        email: this.cipher.email !== this.oldCipher.email ? this.cipher.email : undefined,
        phoneNumber: this.cipher.phoneNumber !== this.oldCipher.phoneNumber ? this.cipher.phoneNumber : undefined,
        link: this.cipher.link !== this.oldCipher.link ? this.cipher.link : undefined,
        status: this.cipher.status !== this.oldCipher.status ? this.cipher.status : undefined
      }
      const result = await apiUpdateCipher(param)
      if (result.status) {
        const newCipherList: ICipher[] = []
        for (const i in this.cipherList) {
          if (this.cipherList[i].id !== this.cipher.id) {
            newCipherList.push(this.cipherList[i])
          }
        }

        const c = result.data
        const cipher: ICipher = {
          id: c.id,
          createTime: c.createTime,
          name: c.name,
          userName: c.userName,
          password: c.password,
          email: c.email,
          phoneNumber: c.phoneNumber,
          link: c.link,
          updateDateTime: moment(c.updateTime).format('YYYY-MM-DD HH:mm:ss'),
          status: c.status
        }
        newCipherList.push(cipher)
        this.cipherList = newCipherList

        this.$message.success('修改成功')
      }
    }
    this.isShowDialog = false
    this.submitLoading = false
  }
}
</script>
