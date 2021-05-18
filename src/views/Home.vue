<template>
  <div>
    <Nav></Nav>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <HealthWork></HealthWork>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import HealthWork from '@/components/echarts/HealthWork.vue'

@Component({
  name: 'Home',
  components: {
    Nav,
    HealthWork
  }
})
export default class extends Vue {

}
</script>
