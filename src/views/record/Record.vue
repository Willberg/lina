<template>
  <div>
    <Nav></Nav>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <Calendar></Calendar>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <Timer></Timer>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'
import Calendar from '@/components/echarts/Calendar.vue'
import Timer from '@/components/timer/Timer.vue'

@Component({
  name: 'Record',
  components: {
    Nav,
    Calendar,
    Timer
  }
})
export default class extends Vue {

}
</script>
