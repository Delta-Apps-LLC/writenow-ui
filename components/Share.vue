<template>
    <div class="modal-overlay" @click="close()">
        <div :class="isMobile ? 'modal-mobile' : 'modal'"
          @click.stop
        >
            <v-btn-toggle
              mandatory
              rounded
              v-model="sharing"
            >
              <v-btn>Share Entry</v-btn>
              <v-btn>Share Prompt</v-btn>
            </v-btn-toggle>
            <v-divider />
            <div v-if="sharing === 0">
              <div>
                <v-menu
                  bottom
                  :offset-y="true"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="name-search"
                      v-on="on"
                      v-bind="attrs"
                      v-model="searchText1"
                      placeholder="Search by email or name..."
                      @input="search()"
                    >
                    </v-text-field>
                  </template>
                  <v-list class="result-list">
                      <v-list-item 
                        v-for="(r, i) in resultsE" :key="i" link 
                        @click="pushToList(r)">
                          <v-list-item-subtitle>
                            {{r.firstname}} {{r.lastname}}<v-spacer />{{r.username}}
                          </v-list-item-subtitle>
                          <v-divider />
                      </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div class="share-list">
                <span class="shared-items" v-for="(s, i) in sharedList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="20" @click="unshareEntry(s)">mdi-close</v-icon>
                </span>
                <span class="share-item" v-for="(s, i) in shareEntryList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="20" @click="shareEntryList.splice(i, 1)">mdi-close</v-icon>
                </span>
              </div>
            </div>
            <div v-else-if="sharing === 1">
              <div>
                <v-menu
                  bottom
                  :offset-y="true"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="name-search"
                      v-on="on"
                      v-bind="attrs"
                      v-model="searchText2"
                      placeholder="Search by email or name..."
                      @input="search()"
                    >
                    </v-text-field>
                  </template>
                  <v-list class="result-list">
                      <v-list-item 
                        v-for="(r, i) in resultsP" :key="i" link 
                        @click="pushToList(r)">
                          <v-list-item-subtitle>
                            {{r.firstname}} {{r.lastname}}<v-spacer />{{r.username}}
                          </v-list-item-subtitle>
                          <v-divider />
                      </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div class="share-list">
                <span class="share-item" v-for="(s, i) in sharePromptList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="16" @click="sharePromptList.splice(i, 1)">mdi-close</v-icon>
                </span>
              </div>
            </div>
            <v-btn color="#cccccc" @click="close()">Exit</v-btn>
            <v-btn color="#abddd0" @click="sharing === 0 ? shareEntry() : sharePrompt()">Share</v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Share',

  mounted () {
    this.$store.commit('share/updateResultsE', undefined)
    this.$store.commit('share/updateResultsP', undefined)
  },

  data () {
    return {
        searchText1: "",
        searchText2: "",
        shareEntryList: [],
        sharePromptList: [],
        sharing: 0
    }
  },

  methods: {
    async search () {
      (this.sharing === 0)
      ? await this.$store.dispatch('share/search', {
        searchText: this.searchText1,
        sharing: this.sharing
      })
      : await this.$store.dispatch('share/search', {
        searchText: this.searchText2,
        sharing: this.sharing
      })
    },

    pushToList (r) {
      if (this.sharing === 0) {
        let counter1 = 0
        let counter2 = 0
        for (let i = 0; i < this.sharedList.length; ++i) {
          if (this.sharedList[i].userid === r.userid) {
            alert(`User ${r.username} has already been added`)
            break
          }
          else counter1++
        }
        if (counter1 === this.sharedList.length) {
          for (let i = 0; i < this.shareEntryList.length; ++i) {
            if (this.shareEntryList[i].userid === r.userid) {
              alert(`User ${r.username} has already been added`)
              break
            }
            else counter2++
          }
          if (counter2 === this.shareEntryList.length) this.shareEntryList.push(r)
        }
      }
      else if (this.sharing === 1) {
        let counter = 0
        for (let i = 0; i < this.sharePromptList.length; ++i) {
            if (this.sharePromptList[i].userid === r.userid) {
              alert(`User ${r.username} has already been added`)
              break
            }
            else counter++
          }
          if (counter === this.sharePromptList.length) this.sharePromptList.push(r)
      }
    },

    async sharePrompt() {
      await this.$store.dispatch('share/sharePrompt', {
        prompt: this.promptBeingShared,
        sender: this.user.id,
        users: this.sharePromptList
      })
      this.sharePromptList = []
    },

    async shareEntry () {
      for (let i = 0; i < this.shareEntryList.length; ++i) {
        this.shareEntryList[i] = this.shareEntryList[i].userid
      }
      await this.$store.dispatch('share/shareEntry', {
        entry: this.entryBeingShared,
        owner: this.user.id,
        users: this.shareEntryList,
        title: 'Shared Entry',
      })
      this.shareEntryList = []
    },

    unshareEntry (s) {
      this.$store.dispatch('share/unshareEntry', {
        entry: this.entryBeingShared,
        userid: s.userid,
        type: "owner"
      })
    },

    close () {
      this.shareEntryList = []
      this.sharePromptList = []
      this.$emit('close-modal')
    }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    resultsE () {
      return this.$store.state.share.resultsE
    },

    resultsP () {
      return this.$store.state.share.resultsP
    },

    sharedList () {
      return this.$store.state.share.sharedList
    },

    entryBeingShared () {
      return this.$store.state.share.entryBeingShared
    },

    promptBeingShared () {
      return this.$store.state.share.promptBeingShared
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 475px;
  width: 500px;
  margin-top: 6%;
  padding: 0px 0;
  border-radius: 20px;
}

.modal-mobile {
  text-align: center;
  background-color: #EBEBEB;
  height: 60%;
  width: 90%;
  margin-top: 15%;
  padding: 0px 0;
  border-radius: 20px;
}

.result-list {
  max-height: 150px;
  position: relative;
}

.share-list {
  background-color: #eeeeee;
  position: inherit;
  margin-top: 35%;
  height: 125px;
  overflow: auto;
  text-align: left;
  width: 100%;
  bottom: 30px;
  border-radius: 10px;
}

.shared-items {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  background-color: #bdd0e7;
  font-size: 12px;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 3px;
  margin-top: 5px;
  border-radius: 10px;
}

.share-item {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  background-color: #cccccc;
  font-size: 12px;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 3px;
  margin-top: 5px;
  border-radius: 10px;
}

.name-search {
  padding: 5px;
}

</style>
