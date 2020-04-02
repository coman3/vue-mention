<template>
  <div>
    <p @keydown="onKey" ref="editable" class="editable" :contenteditable="!isEditingMention"></p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MentionResultProvider from "../MentionResultProvider";
import DropDown from "./DropDown.vue";
import MentionElement from './MentionElement.vue';
@Component({
  components: {
    DropDown
  }
})
export default class Editor extends Vue {

  @Prop()
  resultProvider?: MentionResultProvider;

  isEditingMention = false;

  $refs!: {
    editable: HTMLParagraphElement;
  }

  private currentMention: MentionElement | null = null;

  private spawnMention(): MentionElement {
    const span = new MentionElement();
    span.isActive = true;
    span.content = "@";
    span.resultProvider = this.resultProvider;
    span.$on("submit", (element: any) => {
      console.log("Mention Submitted", element);
      this.isEditingMention = false;
      this.setFocusOnEnd();
      this.currentMention = null;
    });
    span.$on("destroy", () => {
      console.log("Mention Destroyed");
      this.isEditingMention = false;
      this.destroyMention(this.currentMention);
    })
    span.$mount(); // We need to allow vue to create the element from the template
    const element = this.$refs.editable.appendChild(span.$el) as HTMLSpanElement; // Add the element exactly where we want it.

    span.focusEnd();
    return span;
  }

  private setFocusOnEnd(createNodeIfNotThere = true) {

    console.log(this.$refs.editable.childNodes[this.$refs.editable.childNodes.length - 1]);
    if (createNodeIfNotThere && this.$refs.editable.childNodes[this.$refs.editable.childNodes.length - 1].nodeType != 3) {
      this.$refs.editable.appendChild(document.createTextNode('\u00A0'));
    }
    const newPosition = document.createRange();
    newPosition.setStart(this.$refs.editable, this.$refs.editable.childNodes.length);

    const documentSelection = window.getSelection();
    if (documentSelection != null) {
      documentSelection.removeAllRanges();
      documentSelection.addRange(newPosition);
      setTimeout(() => {
        this.$refs.editable.focus();
      }, 0);
    }
  }

  private destroyMention(mention: MentionElement | null) {
    if (mention == null) return;

    const text = mention.content;
    this.$refs.editable.appendChild(document.createTextNode(text ?? ""));

    this.$refs.editable.removeChild(mention.$el);
    mention.$destroy();
    this.currentMention = null;

    this.setFocusOnEnd(false);
  }

  onKey(event: KeyboardEvent) {
    if (this.currentMention != null) return;
    switch (event.key) {
      case "@": {
        // if (this.currentMention != null) {
        //   this.destroyMention(this.currentMention);
        // }
        this.currentMention = this.spawnMention();
        this.isEditingMention = true;
        event.preventDefault();
        break;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.editable:focus-within {
  outline: none;
  border: 1px solid #cccccc;
}
.editable {
  margin: 10px;
  line-height: 25px;
  max-width: 800px;
  padding: 5px;
  min-height: 60px;
  border: 1px solid #eeeeee;
  border-radius: 3px;
  background-color: #fafafa;
}
</style>
