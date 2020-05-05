<template>
  <div>
    <p @keydown="onKey" ref="editable" class="editable" :contenteditable="!isEditingMention"></p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MentionResultProvider from "../../models/MentionResultProvider";
import DropDown from "./DropDown.vue";
import MentionElement from './MentionElement.vue';
@Component({
  components: {
    DropDown
  }
})
export default class Editor extends Vue {
  /** Allows ys to keep track of if we are editing a mention or not */
  private get isEditingMention() { return this.currentMention != null; }
  /** Store the current mention we are editing */
  private currentMention: MentionElement | null = null;

  $refs!: {
    editable: HTMLParagraphElement;
  }

  /**
   * The provider for what data should be shown on the mention dropdowns
   */
  @Prop()
  resultProvider?: MentionResultProvider;


  /** 
   * Call when a mention has been completed with some data 
   * 
   */
  private onMentionSubmit(mentionElement: MentionElement, mentionData: any) {
    this.setFocusOnNextChildStart();
    this.currentMention = null;
  }

  /** 
   * Call when a mention has been destroyed
   */
  private onMentionDestroy(mentionElement: MentionElement) {
    if (mentionElement == null) return;

    const text = mentionElement.content;
    this.setFocusOnNextChildStart(true, text);
    this.$refs.editable.removeChild(mentionElement.$el);
    mentionElement.$destroy();
    if (this.currentMention == mentionElement) {
      this.currentMention = null;
    }

  }

  private spawnElementAtSelection(newElement: HTMLElement, focusStartOfNextChild = false) {
    const documentSelection = window.getSelection();
    const element = documentSelection?.focusNode as Text;
    if (documentSelection != null && element != null && element.nodeValue != null) {
      const node1 = document.createTextNode(element.nodeValue.substring(0, documentSelection.focusOffset).trimEnd() + "\u00A0");
      const node2 = document.createTextNode("\u00A0" + element.nodeValue.substring(documentSelection.focusOffset, element.nodeValue.length).trimStart());
      this.$refs.editable.insertBefore(node1, element);
      this.$refs.editable.insertBefore(newElement, element);
      this.$refs.editable.insertBefore(node2, element);
      this.$refs.editable.removeChild(element);
      if (focusStartOfNextChild) {
        documentSelection.removeAllRanges();

        const newPosition = document.createRange();
        newPosition.setStart(node2, 0);
        documentSelection.addRange(newPosition);

      }
      return true;
    }
    return false;
  }

  private spawnMention(): MentionElement {
    const span = new MentionElement();
    span.isActive = true;
    span.content = "@";
    span.resultProvider = this.resultProvider;
    span.$on("submit", (data: any) => this.onMentionSubmit(span, data));
    span.$on("destroy", () => this.onMentionDestroy(span));
    span.$mount(); // We need to allow vue to create the element from the template
    const documentSelection = window.getSelection();
    const element = documentSelection?.focusNode as Text;
    if (!this.spawnElementAtSelection(span.$el)) {
      this.$refs.editable.appendChild(span.$el) as HTMLSpanElement; // Add the element exactly where they would normaly want it 
    }



    span.setFocusEnd();
    return span;
  }

  private setFocusOnNextChildStart(createNodeIfNotThere = true, contentToAdd = "\u00A0") {
    const documentSelection = window.getSelection();
    const newPosition = document.createRange();
    let positionSet = false;
    if (documentSelection != null) {
      for (let index = 0; index < this.$refs.editable.childNodes.length; index++) {
        const element = this.$refs.editable.childNodes[index];
        if (element == documentSelection.focusNode) {
          if (index + 1 < this.$refs.editable.childNodes.length) { // is textNode
            const nextNode = this.$refs.editable.childNodes[index + 1];
            nextNode.nodeValue = contentToAdd + nextNode.nodeValue?.trimStart()
            newPosition.setStart(nextNode, contentToAdd.length);
            positionSet = true;
          }
          break;
        }
      }

      if (!positionSet) {
        let lastElement = this.$refs.editable.childNodes[this.$refs.editable.childNodes.length - 1];
        if (lastElement.nodeType != 3) { // is last element not a textNode (3)?
          lastElement = document.createTextNode(contentToAdd);
          this.$refs.editable.appendChild(lastElement);
        }
        if (lastElement != null && lastElement.nodeValue != null) {
          newPosition.setStart(lastElement, lastElement.nodeValue.length);
        }
      }
      documentSelection.removeAllRanges();
      documentSelection.addRange(newPosition);
      // Do i even need to explain why this is here... Javascript is the reason...
      setTimeout(() => {
        this.$refs.editable.focus();
      }, 0);
    }
  }

  onKey(event: KeyboardEvent) {
    if (this.currentMention != null) return;
    switch (event.key) {
      case "@": {
        this.currentMention = this.spawnMention();
        event.preventDefault();
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (!this.isEditingMention) {
          
          this.spawnElementAtSelection(document.createElement("br"), true)
        }
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
