<template>
  <div class="dropdown" v-bind:style="getStyle()">some text here</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropDown extends Vue {
  @Prop() node?: HTMLSpanElement;
  getStyle() {
    if (this.node == undefined) return {};
    const rect = this.node.getBoundingClientRect();
    console.log("elements", this.node, rect)
    return {
      top: rect.top,
      left: rect.left,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown {
  position: fixed;
  background-color: white;
  border: red solid 1px;
  padding: 10px;
}
</style>
