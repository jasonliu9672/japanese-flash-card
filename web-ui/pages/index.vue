<template>
  <v-container fluid>
    <v-row justify="start" align="center">
      <v-col cols="12">
        <div id="flashcard-app" class="container">
          <ul class="flashcard-list">
            <li
              v-on:click="toggleCard(card)"
              v-for="(card, index) in cards"
              :key="index"
            >
              <transition name="flip">
                <p v-bind:key="card.flipped" class="card" :class="{flipped: card.flipped}">
                  {{ card.flipped ? card.chinese + "(" + card.kanji + ")" : card.kana }}
                  <span v-on:click="cards.splice(index, 1)" class="delete-card"
                    >X</span
                  >
                </p>
              </transition>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
    <v-speed-dial v-model="fab" bottom right fixed class="float-right">
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-format-list-bulleted </v-icon>
        </v-btn>
      </template>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="indigo" @click="addDialog = true"  v-on="on" v-bind="attrs">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add New Flash Card</span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab dark small color="red" v-bind="attrs" v-on="on" @click="getFlashCards">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh All Flash Cards</span>
      </v-tooltip>
    </v-speed-dial>
    <v-dialog v-model="addDialog" max-width="500">
      <v-card>
        <v-card-title class="headline"> 新しい単語を追加する </v-card-title>
        <v-card-text
          ><v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                outlined
                  label="中文"
                  v-model="newCard.chinese"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                 <v-text-field
                 outlined
                  label="漢字"
                  v-model="newCard.kanji"
                ></v-text-field>
              </v-col>
            </v-row>
                  <v-row>
              <v-col>
                 <v-text-field
                 outlined
                  label="拼音"
                  v-model="newCard.kana"
                ></v-text-field>
              </v-col>
            </v-row>
            </v-container
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="addDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-1" text @click="addDialog = false; addNew();">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      addDialog: false,
      cards: [],
      newCard: {
        kanji: "",
        kana: "",
        chinese: ""
      }
    };
  },
  methods: {
    toggleCard (card) {
      card.flipped = !card.flipped;
    },
    getFlashCards () {
      let vm = this
      axios.get('http://127.0.0.1:5001/japanese-flash-card-a8a7a/us-central1/app/flashcards')
      .then( res => vm.cards = res.data.map( card => {return {...card,flipped:false}}))
    },
    addNew() {
      if (!this.newCard.kanji || !this.newCard.kana || !this.newCard.chinese) {
        this.error = true;
      } else {
        axios
      .post('http://127.0.0.1:5001/japanese-flash-card-a8a7a/us-central1/app/flashcards/create',this.newCard)
      .then(response => {
        this.getFlashCards()
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
    },
  },
  created(){
    this.getFlashCards()
  },
  components: {},
};
</script>
<style lang="scss">
body {
  font-family: "Montserrat", sans-serif;
}

ul {
  padding-left: 0;
  display: flex;
  flex-flow: row wrap;
}

li {
  list-style-type: none;
  padding: 10px 10px;
  transition: all 0.3s ease;
}

.container {
  max-width: 100%;
  padding: 2em;
}

.card {
  display: block;
  width: 150px;
  height: 175px;
  padding: 50px 5px 30px 5px;
  background-color: #51aae5;
  border-radius: 7px;
  margin: 5px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  position: relative;
  color: #fff;
  font-weight: 600;
  font-size: 40px;
  -webkit-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  -moz-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  will-change: transform;
}

li:hover {
  transform: scale(1.1);
}

li:nth-child(-n + 3) .card {
  background-color: #e65f51;
}

li:nth-child(2n + 1) .card {
  background-color: #a17de9;
}

li:nth-child(4n) .card {
  background-color: #feca34;
}

li:nth-child(5n-2) .card {
  background-color: #51aae5;
}

li:nth-child(4n + 4) .card {
  background-color: #feca34;
}

li:nth-child(-7n + 7) .card {
  background-color: #e46055;
}

.delete-card {
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px 10px;
  opacity: 0.4;
  transition: all 0.5s ease;
}

.delete-card:hover,
.error {
  opacity: 1;
  transform: rotate(360deg);
}

.flip-enter-active {
  transition: all 0.4s ease;
}

.flip-leave-active {
  display: none;
}

.flip-enter,
.flip-leave {
  transform: rotateY(180deg);
  opacity: 0;
}
.flipped {
    font-size: 25px;
}
</style>