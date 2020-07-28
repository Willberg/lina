<template>
  <div>
    <Nav></Nav>
    todoList
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Nav from "@/components/navbar/index.vue";

@Component({
  name: 'TodoList',
  components: {
    Nav
  }
})
export default class extends Vue {

}
</script>
