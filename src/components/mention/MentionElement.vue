<template>
  <span
    :contenteditable="isActive"
    @keydown="onKey"
    @blur="onBlur"
    :class="{ mention: true, active: isActive }"
  >{{content}}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MentionResultProvider, { MentionResults, MentionType } from '../MentionResultProvider';
import DropDown from './DropDown.vue';

@Component
export default class MentionElement extends Vue {

  $el!: HTMLSpanElement;

  @Prop()
  isActive = false;
  @Prop()
  content?: string;

  @Prop()
  resultProvider?: MentionResultProvider;

  filteredResults?: MentionResults;
  dropDownElement?: DropDown;
  
  focusEnd() {
    const selection = window.getSelection(); // allows us to manage what / where the user has selected / is entering text
    if (selection != null) {
      selection.setPosition(this.$el, 1);
      const element = this.$el as HTMLSpanElement;
      setTimeout(() => { // This is required to allow the element to be displayed first.... #Wtaf Javascript
        element.focus();
      }, 0);
    } else {
      // Fuck, their browser dosnt support this api... This will be a fun time.... #completelybreakseverythingbecausejavascriptsucks
      // Do something about this other than a shitty alert...
      // See: https://developer.mozilla.org/en-US/docs/Web/API/Selection#Browser_compatibility for what supports this api.
      alert("Your browser dosnt do what we dang need it to do to make mentions work.... Please use something modern, thanks.");
    }
  }

  onBlur() {
    if (this.isActive && this.dropDownElement == undefined) {
      this.$emit("destroy");
    }
  }

  async onKey(event: KeyboardEvent) {
    switch (event.key) {

      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        if (this.dropDownElement == undefined) break;

        if (event.key == "ArrowUp") {
          this.dropDownElement.selectedIndex -= 1;
        } else {
          this.dropDownElement.selectedIndex += 1;
        }

        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        break;
      }
      case "ArrowRight":
      case "Backspace":
      case "Escape": {
        if (this.content == undefined) return;


        if (this.content.length > 1 && event.key == "Backspace") {
          this.content = this.content.substring(0, this.content.length - 1);
          if (this.resultProvider != undefined && this.content != undefined) {
            this.filteredResults = await this.resultProvider.fetchResults(this.content.substring(1, this.content.length));
          }
          if (this.dropDownElement != undefined && this.filteredResults != undefined && this.dropDownElement.elements != this.filteredResults.results) {
            this.dropDownElement.elements = this.filteredResults.results;
          }
        } else if (this.content.length <= 1 || event.key != "Backspace") {
          if (this.dropDownElement != undefined) {
            this.dropDownElement.$destroy();
            document.body.removeChild(this.dropDownElement.$el);
            this.dropDownElement = undefined;
          }
          this.isActive = false;
          this.$emit("destroy");
        }

        event.preventDefault();

        break;
      }
      case "Enter":
      case "Tab": {
        this.submitMention();
        event.preventDefault();
        break;
      }
      default: {
        if (event.key.length == 1) {
          this.content += event.key;
          if (this.resultProvider != undefined && this.content != undefined) {
            this.filteredResults = await this.resultProvider.fetchResults(this.content.substring(1, this.content.length));
          }
          if (this.filteredResults != undefined && this.filteredResults.results.length > 0 && this.dropDownElement == undefined) {
            this.spawnDropdown(this.filteredResults);
          } else if (this.dropDownElement != undefined && this.filteredResults != undefined && this.dropDownElement.elements != this.filteredResults.results) {
            this.dropDownElement.elements = this.filteredResults.results;
          }
          event.preventDefault();
        }
        break;
      }
    }





  }

  submitMention() {
    if (this.dropDownElement != undefined && this.filteredResults != undefined) {

      this.isActive = false;
      document.body.removeChild(this.dropDownElement.$el);
      this.dropDownElement.$destroy();
      this.content = "@" + this.dropDownElement.selectedItem.name;
      this.$el.setAttribute("data-mention-id", this.dropDownElement.selectedItem.id);
      this.$el.setAttribute("data-mention-type", MentionType[this.filteredResults.results.find(x => x.items.includes(this.dropDownElement?.selectedItem))?.type ?? MentionType.User].toString());
      this.$emit("submit", this.dropDownElement.selectedItem);
      this.dropDownElement = undefined;



      return;
    }
  }

  spawnDropdown(results: MentionResults) {
    const dropDown = new DropDown();
    dropDown.node = this.$el as HTMLSpanElement;
    dropDown.elements = results.results;
    dropDown.$mount();
    document.body.appendChild(dropDown.$el);
    console.log(dropDown.$el);

    dropDown.$on("selected", (element: any) => {
      this.submitMention();
    });
    this.dropDownElement = dropDown;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mention:focus-within {
  border: solid 1px red;
  outline: 0px solid transparent;
  padding: 5px;
}
.mention {
  color: blue;
}
.mention.active {
  color: red;
}
</style>
