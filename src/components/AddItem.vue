<template>
  <div class="additem">
    <div class="additem-item-wrapper right">
      <div class="additem-item-inner lightgreen">
        <h2 class="left">呼びかけ <p class="help-button" v-on:click="show">?</p></h2>
        <!--<div>-->
        <div class="tokenize-input-form">
          <TokenizeInputForm @onChangeSelectedWordsListEvent="onChangeSelectedWordsList" :propsItemList="propsItemList" :kuromojiTokenizer="kuromojiTokenizer" />
        </div>
        <button @click="appendTokenizeInputForm">別の言い方を追加</button>
          <!--
          <div v-if="!isSetedProps">
            <div class="tokenize-input-form">
              <TokenizeInputForm @onChangeSelectedWordsListEvent="onChangeSelectedWordsList" />
            </div>
            <button @click="appendTokenizeInputForm">別の言い方を追加</button>
          </div>
          <div v-else>
            <div v-for="(list,index) in uttrSelectedWordList" :key="index">
              <TokenizeInputForm :propsList="list" @onChangeSelectedWordsListEvent="onChangeSelectedWordsList" />
            </div>
          </div>
          -->
        <!--</div>-->
      </div>
    </div>
    <div class="additem-item-wrapper left">
      <div class="additem-item-inner gainsboro">
        <h2>応答</h2>
        <input type="text" v-model="replyText" placeholder="例: 元気です">
        <h2>感情</h2>
        <select v-model="motion">
          <option value="" selected>無</option>
          <option value="fun">喜</option>
          <option value="angry">怒</option>
          <option value="sad">悲</option>
        </select>
      </div>
    </div>
    <div>
      <div>
        <button v-on:click="onClickedSumbit">保存する</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import firestore from '@/firebase/firestore'
import { collection, addDoc } from 'firebase/firestore/lite'
import TokenizeInputForm from './TokenizeInputForm.vue'
import kuromoji from "kuromoji"
export default {
  name: 'AddItem',
  components: {
    TokenizeInputForm
  },
  props: {
    propsItemList: null
    //propsItem: null
  },
  data: function () {
    return {
      id: null,
      isSetedProps: false,
      uttrSelectedWordList: {},
      replyText: "",
      motion: "",
      kuromojiTokenizer: null
    }
  },
  /*
  watch: {
    propsItem() {
      if (this.propsItem.id==undefined) {
        this.isSetedProps = false
        return false
      }
      this.isSetedProps = true
      this.uttrSelectedWordList = this.propsItem.utterance
      this.uttrSelectedWordList.splice();
      this.id = this.propsItem.id
      this.replyText = this.propsItem.reply
      this.motion = this.propsItem.emotion_name
    }
  },
  */
  methods: {
    show: function() {
      this.$emit('onClickHelpEvent', null)
    },
    appendTokenizeInputForm: function() {
      var ComponentClass = Vue.extend(TokenizeInputForm)
      var instance = new ComponentClass({
        propsData: {
          propsItemList: this.propsItemList,
          kuromojiTokenizer: this.kuromojiTokenizer
        }
      })
      instance.$mount()
      instance.$on("onChangeSelectedWordsListEvent", this.onChangeSelectedWordsList)
      document.getElementsByClassName('tokenize-input-form')[0].appendChild(instance.$el)
    },
    onChangeSelectedWordsList: function(selectedWordList) {
      this.$set(this.uttrSelectedWordList, selectedWordList.id, selectedWordList.list)
    },
    onClickedSumbit: function() {
      let uttrList = Object.values(this.uttrSelectedWordList).filter(e=>e.length!=0)
      if (uttrList.length==0) {
        alert("発言を設定してください")
        return false
      } else if (!this.replyText || !this.replyText.match(/\S/g)) {
        alert("返答を設定してください")
        return false
      }
      const objUttrList = uttrList.map(e=>Object.assign({}, e));
      let docObj = {
        "utterance": objUttrList,
        "reply": this.replyText.trim(),
        "emotion_name": this.motion
      }
      // firestoreにぶちこむ https://firebase.google.cn/docs/firestore/manage-data/add-data?hl=ja
      const col = collection(firestore, 'live2d_talk')
      addDoc(col, docObj).then(doc=>{
        alert("保存しました")
        console.log(doc.id)
        // 初期化する
        this.id = null
        this.uttrSelectedWordList = {}
        this.replyText = ""
        this.motion = ""
        document.getElementsByClassName('tokenize-input-form')[0].innerHTML = ""
        this.appendTokenizeInputForm()
        //
        this.$emit('onSubmitEvent', null)
      }).catch(error=>{
        alert("保存に失敗しました")
        console.error(error)
      })
    }
  },
  mounted: function() {
    // kuromoji.builderは毎回辞書をロードするっぽいので、一回だけ呼び出さないとボトルネックになってしまう。
    kuromoji.builder({ dicPath: "/dict" }).build((err, tokenizer) => {
      if(err){
        alert("読み込みに失敗しました")
        console.log(err)
      }
      this.kuromojiTokenizer = tokenizer
    })
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
}
.help-button {
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  font-size: 0.8em;
  text-align: center;
  color: lightgray;
  background-color: gray;
  cursor: pointer;
}
.additem {
  padding: 25px;
}
.additem-item-inner {
  display: inline-block;
  margin: 5px;
  padding: 15px;
  border-radius: 15px;
  max-width: 50%;
}
.right {
  text-align: right;
}
.left {
  text-align: left;
}
.lightgreen {
  background-color: lightgreen;
}
.gainsboro {
  background-color: gainsboro;
}
</style>
