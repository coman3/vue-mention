<template>
  <v-menu
    transition="slide-y-transition"
    :attach="node.parentNode"
    :value="true"
    :disable-keys="true"
    :activator="node"
    bottom
    nudge-bottom="24px"
    nudge-left="-5px"
  >
    <v-list dense disabled>
      <template v-for="type in elements">
        <v-list-item-group v-model="selectedItem" :key="type.type + 'group'" color="primary">
          <v-subheader :key="type.type + 'header'">{{type.title}}</v-subheader>
          <v-list-item
            dense
            v-for="item in type.items"
            :key="item.id"
            :value="item"
            @click="onClick(item)">
            <v-list-item-icon v-if="type.type == 1">
              <v-icon v-text="'mdi-flag'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { MentionResult } from '../../models/MentionResultProvider';
import { Mention } from '../../models/MentionResultProvider';
import * as CSS from "csstype";
import vuetify from "../../plugins/vuetify";

@Component({
  vuetify
})
export default class DropDown extends Vue {
  @Prop()
  node?: HTMLSpanElement;
  @Prop()
  elements: MentionResult<Mention>[] = [];

  @Prop()
  selectedIndex = 0;

  get selectedItem(): Mention {
    const allItems = this.getAllItems();
    return allItems[this.selectedIndex];
  }


  onClick(item: Mention) {
    this.selectedIndex = this.getAllItems().indexOf(item);
    this.$emit("selected", this.selectedItem, this.selectedIndex);
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
</style>
