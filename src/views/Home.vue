<template>
  <div>
    <Nav></Nav>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <HealthWork></HealthWork>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <Timer></Timer>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <Calendar></Calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import HealthWork from '@/components/echarts/HealthWork.vue'
import Calendar from '@/components/echarts/Calendar.vue'
import Timer from '@/components/timer/Timer.vue'

@Component({
  name: 'Home',
  components: {
    Nav,
    HealthWork,
    Calendar,
    Timer
  }
})
export default class extends Vue {

}
</script>
