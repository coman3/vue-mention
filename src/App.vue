<template>
  <div>
    <Editor :resultProvider="resultProvider"></Editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Editor from './components/mention/Editor.vue';
import MentionResultProvider, { MentionResults } from './models/MentionResultProvider';

class MyMentionResultProvider extends MentionResultProvider {
  async fetchAsync(filter: string): Promise<MentionResults> {
    const results = await super.fetchAsync(filter);
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
