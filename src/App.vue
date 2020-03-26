<template>
  <div>
    <p @keydown="onKey" ref="editable" class="editable" contenteditable="true"></p>
    <DropDown node="currentMention"></DropDown>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DropDown from './components/DropDown.vue';

const database = {
  users: [
    {
      id: "guid1",
      name: "User One",
    },
    {
      id: "guid2",
      name: "User Two",
    },
    {
      id: "guid3",
      name: "User Three",
    },
    {
      id: "guid4",
      name: "User Four",
    }
  ],
  tasks: [
    {
      id: "guid5",
      name: "Task One",
    },
    {
      id: "guid6",
      name: "Task Two",
    },
    {
      id: "guid7",
      name: "Task Three",
    },
    {
      id: "guid8",
      name: "Task Four",
    }
  ]
}


@Component({
  components: {
    DropDown,
  },
})
export default class App extends Vue {

  private editable(): HTMLParagraphElement { return this.$refs.editable as HTMLParagraphElement }
  private currentMention: HTMLSpanElement | null = null;

  private spawnMention(): HTMLSpanElement {
    const span = document.createElement("span");
    span.classList.add("mention", "active");
    span.innerText = "@";
    this.editable().appendChild(span)

    const selectobj = window.getSelection();
    if (selectobj != null) {
      selectobj.setPosition(span, 1);
    }
    return span;
  }

  private setFocusOnEnd(createNodeIfNotThere = true) {

    if (createNodeIfNotThere && this.editable().childNodes[this.editable().childNodes.length].nodeType != 3) {
      this.editable().appendChild(document.createTextNode('\u00A0'));
    }
    const newPosition = document.createRange();
    newPosition.setStart(this.editable(), this.editable().childNodes.length);

    const documentSelection = window.getSelection();
    if (documentSelection != null) {
      documentSelection.removeAllRanges();
      documentSelection.addRange(newPosition);
      this.editable().focus();
    }
  }

  private destroyMention(mention: HTMLSpanElement) {
    if (this.currentMention == null) return;

    const text = this.currentMention.innerText;
    this.editable().appendChild(document.createTextNode(text));

    this.setFocusOnEnd(false);

    this.editable().removeChild(this.currentMention);
    this.currentMention = null;
  }

  onKey(event: KeyboardEvent) {
    switch (event.key) {
      case "@": {
        if (this.currentMention != null) {
          this.destroyMention(this.currentMention);
        }
        this.currentMention = this.spawnMention();
        event.preventDefault();
        break;
      }

      case "Backspace":
      case "Escape":
      case "ArrowLeft":
      case "ArrowRight": {
        if (this.currentMention == null) break;
        if (event.key == "Backspace" && this.currentMention.innerText.length >= 1) {
          break;
        }

        break;
      }

      case "Enter": {
        if (this.currentMention != null) {

          console.log("Filter", this.currentMention.innerText);
          const filter = this.currentMention.innerText.toLowerCase().replace("@", "");
          const results: any[] =
            database.users.filter(x => this.currentMention != null && x.name.toLowerCase().includes(filter)).map(x => Object.assign(x, { type: "user" })).concat(
              database.tasks.filter(x => this.currentMention != null && x.name.toLowerCase().includes(filter)).map(x => Object.assign(x, { type: "task" })));
          console.log("Results", results);
          this.currentMention.setAttribute("data-target-id", results[0].id);
          this.currentMention.setAttribute("data-target-type", results[0].type);
          this.currentMention.setAttribute("contenteditable", "false");
          this.currentMention.innerText = "@" + results[0].name;
          this.currentMention.classList.remove("active");
          
          this.setFocusOnEnd(false);

          this.currentMention = null;

        }
        console.log(this.editable().innerHTML);
        event.preventDefault();
        break;
      }

      default: {
        if (event.keyCode < 48 || event.keyCode > 90) break; //we dont want to catch any special keys (like function, or control keys)
        if (this.currentMention != null && event.keyCode) {
          const mentionText = this.currentMention.innerText.replace("@", "") + event.key;
          console.log(mentionText);
          console.log(database.users.filter(x => x.name.includes(mentionText)));
          console.log(database.tasks.filter(x => x.name.includes(mentionText)));
        }
      }
    }
  }

}


</script>

<style lang="scss">
.editable:focus-within {
  border: 1px solid grey;
}
.editable {
  padding: 5px;
  min-height: 60px;
  border: 1px solid grey;
  border-radius: 3px;
  background-color: #eeeeee;
}
.editable .mention {
  color: blue;
}
.editable .mention.active {
  color: red;
}
</style>
