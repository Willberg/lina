<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="2" style="margin-top: 10px;">
        加密算法：
      </el-col>
      <el-col :xs="14" :sm="12" :md="8" :lg="4" :xl="4">
        <el-select v-model="encryptAlgorithm" placeholder="请选择" @change="handleSelectAlgorithm">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11" style="margin-top: 10px;">
        <el-row :gutter="24">
          <el-col>
            <el-input type="textarea" :rows="10" v-model="pendingEncode" placeholder="请输入需要加密的内容"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col>
            <el-button type="primary" @click.native.prevent="handleEncode">加密</el-button>
            <el-button v-show="canDecode" type="info" v-clipboard:copy="pendingEncode">拷贝</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="{span: 11, offset: 2}" :xl="{span: 11, offset: 2}"
              style="margin-top: 10px;">
        <el-row :gutter="24">
          <el-col>
            <el-input type="textarea" :rows="10" v-model="pendingDecode" placeholder="请输入需要解密的内容"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col>
            <el-button v-show="canDecode" type="primary" @click.native.prevent="handleDecode">解密</el-button>
            <el-button type="info" v-clipboard:copy="pendingDecode">拷贝</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import md5 from 'js-md5'
import { Base64 } from 'js-base64'
import { options } from '@/constant/toolConstant'

@Component({
  name: 'Encryption'
})
export default class extends Vue {
  private canDecode = true
  private encryptAlgorithm = 'Base64'
  private pendingEncode = ''
  private pendingDecode = ''
  private options = options

  private handleSelectAlgorithm (algorithm: string) {
    if (algorithm === 'MD5') {
      this.canDecode = false
    } else {
      this.canDecode = true
    }
  }

  private handleEncode () {
    if (this.encryptAlgorithm === 'MD5') {
      this.pendingDecode = md5(this.pendingEncode)
    } else {
      this.pendingDecode = Base64.encode(this.pendingEncode)
    }
  }

  private handleDecode () {
    if (this.encryptAlgorithm === 'Base64') {
      this.pendingEncode = Base64.decode(this.pendingDecode)
    }
  }
}
</script>
