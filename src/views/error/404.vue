<template>
  <div style="width:100%; height:100%; background-color: #2c3e50;">
    <Nav></Nav>
    <div style="padding-top:20%; color: #bfcbd9; font-size: 50px; text-align: center;">
      没有找到
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nav from "@/components/navbar/index.vue";

@Component({
  name: 'Page404',
  components: {
    Nav
  }
})
export default class extends Vue {

}
</script>
