<template>
  <div class="dropdown" :style="getStyle()">
    <div class="empty" v-if="elements.length <= 0">No Results...</div>
    <div v-for="type in elements" :key="type.type">
      <div class="title">{{type.title}}</div>
      <ul>
        <li
          v-for="item in type.items"
          :key="item.id"
          :class="{active: selectedItem == item }"
          @click="onClick(item)"
        >{{item.name}}</li>
      </ul>
    </div>
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

  mounted() {
    window.addEventListener("resize", this.onResize);
  }
  

  beforeDestroy() {
    super.$destroy();
    window.removeEventListener("resize", this.onResize);
  }

  private onResize() {
    this.$forceUpdate();
  }
  get selectedItem(): any {
    const allItems = this.getAllItems();
    return allItems[this.selectedIndex];
  }


  onClick(item: any) {
    this.selectedIndex = this.getAllItems().indexOf(item);
    this.$emit("selected", this.selectedItem, this.selectedIndex);
  }

  getStyle() {
    if (this.node == undefined) return {};
    const rect = this.node.getBoundingClientRect();
    const styles = {
      top: (rect.y + rect.height),
      left: (rect.x),
    } as any;

    if (styles.left > window.innerWidth - 200) {
      styles.left = null;
      styles.right = 5;
    }
    if (styles.top > window.innerHeight - 200) {
      styles.top = null;
      styles.bottom = window.innerHeight - rect.y + 5;
    }

    for (const key in styles) {
      if (styles[key] == null) continue;
      styles[key] = styles[key] + "px";
    }

    return styles;
  }

  getAllItems(): any[] {
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
  border-radius: 4px;
  border: grey solid 1px;
  background-color: #fafafa;
  max-width: 200px;
}
.dropdown .empty {
  padding: 10px;
}

.dropdown .title {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  padding: 5px;
}
ul li {
  list-style: none;
  cursor: pointer;
  padding: 5px;
  background-color: #ffffff;
}
li.active {
  background-color: #cfcfcf;
}
</style>
