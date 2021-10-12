<template>
  <div class="tokenize-input-form">
    <input type="text" v-model="uttr" placeholder="例: 元気ですか"><button v-on:click="onClickSpeechRecognitionEvent">声で入力</button>
    <div><label v-for="(text, index) in tokensList" :key="index"><input type="checkbox" :value="text" v-model="selectedWord">{{text}} | </label></div>
    <div>
      <p v-if="existItemList.length!=0" style="margin:0;padding:0;color:red;">同じものが存在しています</p>
      <ul style="margin:0;padding:0;list-style:none;">
        <li v-for="item in existItemList" :key="item.id"><a :href="anker(item.id)">{{item.id}}</a></li>
      </ul>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
  name: 'AddItem',
  props: {
    //propsList: {},
    propsItemList: null,
    kuromojiTokenizer: null
  },
  data: function () {
    return {
      uttr: "",
      tokensList: [],
      selectedWord: [],
      childId: null,
      existItemList: [],
      recognitionText: ""
    }
  },
  watch: {
    /*
    propsList() {
      console.log("watch", this.propsList);
    },
    */
    uttr() {
      if (this.kuromojiTokenizer!=undefined&&this.kuromojiTokenizer!=null) {
        const tokens = this.kuromojiTokenizer.tokenize(this.uttr)
        console.log(tokens)
        this.tokensList = tokens.map(e=>{
          // 読みを返す
          if (e.reading==undefined) {
            return e.surface_form
          }
          return e.reading
          /*
          if (e.basic_form != "*") {
            return e.basic_form
          } else {
            return e.surface_form
          }
          */
        })
        // this.selectedWordのうち、this.tokensListと一致してるものだけ残す。
        this.selectedWord = this.selectedWord.map(e=>{
          if (this.tokensList.includes(e)) {
            return e
          }
        }).filter(Boolean)
      }
    },
    selectedWord() {
      this.$emit('onChangeSelectedWordsListEvent', {"id": this.childId, "list": this.selectedWord})
      this.onChangeSelectedWordsList({"id": this.childId, "list": this.selectedWord})
    }
  },
  methods: {
    anker(id) {
      return "#"+id
    },
    // worker.jsのほうと全く同じ。
    isMatchList: function(said, tokensBasicForm) {
      return said.filter(saidList=>saidList.filter(w=>tokensBasicForm.includes(w)).length==saidList.length).length!=0;
    },
    onChangeSelectedWordsList(selectedWordList) {
      // 既存のものがないか確認する (live2dのほうと同じ)
      if (this.propsItemList!=undefined&&selectedWordList!=undefined) {
        if (selectedWordList.list.length>0) {
          let replyObj = this.propsItemList.filter(e=>this.isMatchList(e.utterance.map(f=>Object.values(f)), selectedWordList.list))
          this.existItemList = replyObj
        }
      }
      // 
    },
    onClickSpeechRecognitionEvent() {
      let mSpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      let recognition = new mSpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.interimResults = false;
      recognition.start()
      recognition.onresult = (e)=>{
        if (e.results[0].isFinal) {
          let aTxt = e.results[0][0].transcript;
          this.uttr = aTxt;
        }
      }
    }
  },
  created: function(){
    this.childId = Math.random().toString(36).slice(2)
  },
  mounted: function(){
    //console.log("mounted", this.propsList)
  }
}
</script>

<style scoped>
</style>
