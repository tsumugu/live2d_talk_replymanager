<template>
  <div class="edititem">
    <div>
      <select v-model="motion">
        <option value="" selected>無</option>
        <option value="fun">喜</option>
        <option value="angry">怒</option>
        <option value="sad">悲</option>
        <option value="flattering">照</option>
      </select>
    </div>
    <div><textarea v-model="replyText"></textarea></div>
    <div><button v-on:click="onClickedSumbit">変更を保存する</button></div>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import { doc, updateDoc } from 'firebase/firestore/lite'
export default {
  name: 'EditItem',
  props: {
    item: null
  },
  data: function () {
    return {
      motion: "",
      replyText: ""
    }
  },
  methods: {
    onClickedSumbit: function() {
      if (!this.replyText || !this.replyText.match(/\S/g)) {
        alert("返答を設定してください")
        return false
      } else if (this.item.id==null||this.item.id==undefined) {
        alert("エラー")
        return false
      }
      const docm = doc(firestore, 'live2d_talk', this.item.id)
      updateDoc(docm, {
        "reply": this.replyText,
        "emotion_name": this.motion
      }).then(doc=>{
        alert("保存しました")
        console.log(doc)
        this.$emit('onSubmitEvent', null)
      }).catch(error=>{
        alert("変更に失敗しました")
        console.error(error)
      })
      // firebaseでUpdate
      /*
      let uttrList = Object.values(this.uttrSelectedWordList).filter(e=>e.length!=0)
      if (uttrList.length==0) {
        alert("発言を設定してください")
        return false
      } else if (!this.replyText || !this.replyText.match(/\S/g)) {
        alert("返答を設定してください")
        return false
      } else if (this.kuromojiTokenizer==undefined||this.kuromojiTokenizer==null) {
        alert("辞書のロードが終わるまでもう少しだけ待ってください")
        return false
      }
      // uttrListの読み版をつくる
      const uttrListReading = uttrList.map(l=>l.map(m=>this.kuromojiTokenizer.tokenize(m)[0].reading).filter(Boolean))
      //const uniqueUttrListReading = Array.from(new Set(uttrListReading))
      //console.log(uttrListReading, uniqueUttrListReading)
      // 読みと文字を合体
      const uttrListMerged = uttrList.concat(uttrListReading)
      const objUttrListMerged = uttrListMerged.map(e=>Object.assign({}, e))
      let docObj = {
        "utterance": objUttrListMerged,
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
      */
    }
  },
  mounted: function() {
    this.motion = this.item.emotion_name
    this.replyText = this.item.reply
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
}
textarea {
  width: 100%;
}
</style>
