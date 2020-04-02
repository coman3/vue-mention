<template>
  <div class="dropdown" :style="getStyle()">
    <ul v-for="type in elements" :key="type.type">
      <li>
        <b>{{type.title}}</b>
      </li>
      <li
        v-for="item in type.items"
        :key="item.id"
        :class="{active: selectedItem == item }"
        @click="onClick(item)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MentionResult } from '../MentionResultProvider';

@Component
export default class DropDown extends Vue {
  @Prop() 
  node?: HTMLSpanElement;
  @Prop()
  elements: MentionResult<any>[] = [];

  @Prop()
  selectedIndex = 0;



  get selectedItem(): any {
    return this.getAllItems()[this.selectedIndex];
  }


  onClick(item: any) {
    this.selectedIndex = this.getAllItems().indexOf(item);
    this.$emit("selected", this.selectedItem, this.selectedIndex);
  }

  getStyle() {
    if (this.node == undefined) return {};
    const rect = this.node.getBoundingClientRect();
    return {
      top: (rect.y + rect.height) + "px",
      left: (rect.x) + "px",
    }
  }

  private getAllItems(): any[] {
    const tempList: any[] = [];
    this.elements.forEach(x => {
      x.items.forEach(c => {
        tempList.push(c);
      });
    });
    return tempList;
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
li.active {
  background-color: grey;
}
</style>
