<template>
<div>
  <Editor :resultProvider="resultProvider"></Editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Editor from './components/mention/Editor.vue';
import MentionResultProvider, { MentionResults } from './components/MentionResultProvider';

class MyMentionResultProvider extends MentionResultProvider {
  fetch(filter: string): Promise<MentionResults> {
    const results = super.fetch(filter);
    console.log("fetchResults", results);
    return results;
  }
}



@Component({
  components: {
    Editor,
  },
})
export default class App extends Vue {
  resultProvider: MentionResultProvider = new MyMentionResultProvider();

}



</script>

<style lang="scss">
* {
  font-family: "Roboto", sans-serif;
}
</style>
