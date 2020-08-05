<template>
  <div>
    <Nav></Nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from '@/components/navbar/index.vue'

@Component({
  name: 'Tool',
  components: {
    Nav
  }
})
export default class extends Vue {

}
</script>
