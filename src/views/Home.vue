<template>
  <div>
    Todo
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Home'
})
export default class extends Vue {
  mounted () {
    // html加载完成后执行。执行顺序：子组件-父组件
    const user = UserModule.userProfile
    if (user === undefined) {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
