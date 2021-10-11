<template>
  <div id="app">
    <!--<div class="fab"><button v-on:click="onClickFABEvent">show!</button></div>-->
    <div class="modal-wrapper" v-show="isShowModal">
      <div class="modal">
        <div class="modal-body">
          <div style="text-align:right;"><button v-on:click="hide" style="border:none;font-size:3rem">×</button></div>
          <h2>これは何？</h2>
          <p>ゆらぎ対策。</p><p>呼びかけ方は複数考えられるが、それらのうち共通する部分だけに反応するようにすることでゆらぎに対応できる。例えば、元気か尋ねる文はこのように複数の言い回しが考えられるが、どれも「元気」というワードが共通している。そのため、この場合は「元気」を選択すれば良い。</p>
          <p style="text-align:center;"><img src="desc.png" style="width: 60%;"></p>
          <p></p>
        </div>  
      </div>
    </div>
    <div class="talk-items">
      <div class="talk-item">
        <!--<AddItem :propsItem="propsItem" />-->
        <AddItem :propsItemList="itemList" @onClickHelpEvent="show" @onSubmitEvent="loadItemList" />
      </div>
      <hr>
      <div class="talk-item" :id="item.id" v-for="item in itemList" :key="item.id">
        <div class="balloon-wrapper uttr-balloon-wrapper">
          <div class="uttr-balloon-div" v-for="(uttrlist, uttrlist_index) in item.utterance" :key="uttrlist_index">
            <div class="balloon uttr-balloon">
              <p class="uttr-balloon-text" v-for="(uttr, uttr_index) in uttrlist" :key="uttr_index">{{uttr}}</p>
              <!--
              <ul v-for="(uttrlist, uttrlist_index) in item.utterance" :key="uttrlist_index">
                <li v-for="(uttr, uttr_index) in uttrlist" :key="uttr_index">{{uttr_index}}: {{uttr}}</li>
              </ul>
              -->
            </div>
          </div>
        </div>
        <div class="balloon-wrapper reply-balloon-wrapper">
          <p class="balloon reply-balloon">{{textToTwemoji(item.emotion_name)}} {{item.reply}}</p>
        </div>
        <button class="delete-button" v-on:click="onClickDeleteEvent(item.id)">この会話を削除する</button>
        <!--<button v-on:click="onClickEditEvent(item.id)">編集する</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore/lite'
import AddItem from './components/AddItem.vue'

const confirmPromise = (mes)=>{
  return new Promise(resolve=>{
    if (window.confirm(mes)) {
      resolve()
    }
  })
}

export default {
  name: 'App',
  components: {
    AddItem
  },
  data: function () {
    return {
      isShowModal: false,
      itemList: [],
      propsItem: null
    }
  },
  methods: {
    show: function() {
      this.isShowModal = true
    },
    hide: function () {
      this.isShowModal = false
    },
    textToTwemoji: function (name) {
      if (name=="angry") {
        return "(😠怒)"
      } else if (name=="fun") {
        return "(😄喜)"
      } else if (name=="sad") {
        return "(🥲悲)"
      } else {
        return "(😑無)"
      }
    },
    loadItemList: async function () {
      this.itemList = []
      const col = collection(firestore, 'live2d_talk')
      const querySnapshot = await getDocs(col);
      let count = 0
      querySnapshot.forEach((doc) => {
        this.itemList.push(Object.assign({id: doc.id}, doc.data()))
        count++
        if (count>=querySnapshot.size) {
          // this.itemListを逆順にする
          this.itemList = this.itemList.reverse()
          this.itemList.splice()
        }
      })
    },
    /*
    onClickFABEvent: function () {
      this.propsItem = {}
      this.show()
    },
    */
    onClickDeleteEvent: function (id) {
      confirmPromise("本当に削除しますか？").then(()=>{
        console.log("delete it: ", id)
        deleteDoc(doc(firestore, 'live2d_talk', id)).then(res=>{
          alert("削除しました", res)
          this.loadItemList()
        }).catch(error=>{
          alert("削除に失敗しました")
          console.error(error)
        })
      })
    },
    /*
    onClickEditEvent: function (id) {
      const item = this.itemList.filter(e=>e.id==id)
      if (item.length>0) {
        this.propsItem = item[0]
        this.show()
      } else {
        alert("エラー")
      }
    }
    */
  },
  mounted() {
    this.loadItemList()
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
button{
  padding: 5px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  appearance: none;
}

#app {
  margin: 0 !important;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  overflow: scroll;
}
.talk-items {
  overflow: scroll;
  background-color: rgb(240, 240, 240);
}
.modal-wrapper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal {
  padding: 30px;
  width: 80%;
  height: 80%;
  background-color: white;
  text-align: left;
  overflow: scroll;
}
.modal-body > h2 {
  text-align: center;
  margin: 5px;
}
.modal-body > p {
  margin: 0;
}
/*
.fab {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 8;
}
.fab > button {
  width: 3rem !important;
  height: 3rem !important;
  border-radius: 50%;
  border: 1px solid gray;
}
*/
.talk-item {
  margin: 10px;
  padding: 15px;
  border-radius: 15px;
  background-color: rgb(250, 250, 250, 0.9);
}
.balloon-wrapper {
  width: 100%;
}
.balloon {
  margin: 0;
  padding: 15px;
  display: inline-block;
  max-width: 50%;
  border-radius: 15px;
  font-size: 1rem;
}

.uttr-balloon-wrapper {
  text-align: right;
}
.uttr-balloon {
  background-color: lightgreen;
}
.uttr-balloon-div {
  margin: 5px;
}
.uttr-balloon-text {
  margin: 0 0 0 5px;
  padding: 0;
  display: inline-block;
  border-bottom: 1px solid black;
}


.reply-balloon-wrapper {
  text-align: left;
}
.reply-balloon {
  background-color: gainsboro;
}

.delete-button {
  margin: 5px;
}
</style>
