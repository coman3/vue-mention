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

      // case "Backspace":
      // case "Escape":
      // case "ArrowLeft":
      // case "ArrowRight": {
      //   if (this.currentMention == null) break;
      //   if (event.key == "Backspace" && this.currentMention.innerText.length >= 1) {
      //     break;
      //   }

      //   break;
      // }

      // case "Enter": {
      //   if (this.currentMention != null) {

      //     console.log("Filter", this.currentMention.innerText);
      //     const filter = this.currentMention.innerText.toLowerCase().replace("@", "");
      //     // const results: any[] =
      //     //   database.users.filter(x => this.currentMention != null && x.name.toLowerCase().includes(filter)).map(x => Object.assign(x, { type: "user" })).concat(
      //     //     database.tasks.filter(x => this.currentMention != null && x.name.toLowerCase().includes(filter)).map(x => Object.assign(x, { type: "task" })));
      //     // console.log("Results", results);
      //     // this.currentMention.setAttribute("data-target-id", results[0].id);
      //     // this.currentMention.setAttribute("data-target-type", results[0].type);
      //     // this.currentMention.setAttribute("contenteditable", "false");
      //     // this.currentMention.innerText = "@" + results[0].name;
      //     // this.currentMention.classList.remove("active");

      //     this.setFocusOnEnd(false);

      //     this.currentMention = null;

      //   }
      //   console.log(this.$refs.editable.innerHTML);
      //   event.preventDefault();
      //   break;
      // }

      // default: {
      //   if (event.keyCode < 48 || event.keyCode > 90) break; //we dont want to catch any special keys (like function, or control keys)
      //   if (this.currentMention != null && event.keyCode) {
      //     const mentionText = this.currentMention.innerText.replace("@", "") + event.key;
      //     console.log(mentionText);
      //     // console.log(database.users.filter(x => x.name.includes(mentionText)));
      //     // console.log(database.tasks.filter(x => x.name.includes(mentionText)));
      //   }
      // }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.editable:focus-within {
  border: 1px solid grey;
}
.editable {
  margin: 10px auto;
  max-width: 800px;
  padding: 5px;
  min-height: 60px;
  border: 1px solid grey;
  border-radius: 3px;
  background-color: #eeeeee;
}
</style>
