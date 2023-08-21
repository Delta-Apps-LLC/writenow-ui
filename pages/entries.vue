<template>
  <v-app>
    <v-row v-if="windowWidth >= 850">
      <!-- Filters -->
      <v-col :cols="showDate ? 5 : 2">
        <!--Entries Today button-->
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
              class="colBtn"
              v-on="on"
              v-bind="attrs"
              @click="loadEntries()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Reset Filters</span>
        </v-tooltip>
        <br>
        <v-btn class="colBtn" color="#bdd0e7" @click="showDate = !showDate">
            {{(afterDate.length === 0) ? dateHint : afterDate}}
        </v-btn>
        <v-date-picker 
            v-if="showDate"
            v-model="afterDate"
            :max="today"
            elevation="6"
            @click:date="filterDate()"
        >
        </v-date-picker>
        <br>
        <v-menu 
          bottom
          transition="slide-y-transition"
          :offset-y="true"
          :close-on-content-click="true"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="colBtn" color="#bdd0e7" v-bind="attrs" v-on="on">{{topicSort}}</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(t, i) in topics" :key="i" link>
                <v-list-item-title
                  v-text="t.topictext"
                  style='font-size: 10pt;'
                  @click="filterTopic(t)"
                >
                </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <!-- Entries list -->
      <v-col v-if="entriesList.length !== 0">
        <h2 class="text-center" v-if="windowWidth >= 1100">{{filterMethod}}</h2>
        <h3 class="text-center" v-else-if="windowWidth < 1100">{{filterMethod}}</h3>
        <v-row justify="center" align="center" v-for="(entry, i) in entriesList" :key="i">
          <v-card class="card" elevation="5"
            :width="windowWidth >= 1100 ? '450px' : '60%'"
          >
            <v-card-title class="card-title">
              {{entry.prompttext}}
            </v-card-title>
            <v-card-subtitle>
              <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
            </v-card-subtitle>
            <v-card-text v-if="viewState === 'Save' && entryToEdit === entry.entryid">
              <v-textarea
                :value="entry.text"
                @input="textChanged($event)"
              >
              </v-textarea>
            </v-card-text>
            <v-card-text v-else>
              {{entry.text}}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#bdd0e7"
                    v-bind="attrs"
                    v-on="on"
                    @click="getSharedList(entry)"
                  >
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </template>
                <span>Share</span>
              </v-tooltip>
              <v-btn color="#cccccc" @click="deleteEntry(entry)">Delete</v-btn>
              <v-btn
                color="#abddd0"
                :disabled="entryToEdit === null ? false : entryToEdit === entry.entryid ? false : true" 
                @click="(viewState === 'Edit') ? editMode(entry.entryid) : updateEntry(entry)"
              >
                {{(entryToEdit === null) ? viewState : (entryToEdit === entry.entryid) ? "Save" : "Edit"}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
      <v-col v-else>
        <h2 class="text-center"
          v-if="entriesList.length === 0 && windowWidth >= 1100"
        >
          No Entries Found For: {{filterMethod}}
        </h2>
        <h3 class="text-center"
          v-if="entriesList.length === 0 && windowWidth < 1100"
        >
          No Entries Found For: {{filterMethod}}
        </h3>
      </v-col>
      <Share v-show="showShare" @close-modal="showShare = false" />
    </v-row>


    <!-- Small Window or Mobile -->
    <v-col v-else-if="windowWidth < 850 || isMobile">
      <!-- Filters -->
      <v-row>
        <!--Entries Today button-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
              class="rowBtn"
              v-on="on"
              v-bind="attrs"
              @click="loadEntries()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Reset Filters</span>
        </v-tooltip>
        <v-btn class="rowBtn" color="#bdd0e7" @click="showDate = !showDate">
            {{(afterDate.length === 0) ? dateHint : afterDate}}
        </v-btn>
        <v-menu
          bottom
          transition="slide-y-transition"
          :offset-y="true"
          :close-on-content-click="true"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="rowBtn" color="#bdd0e7" v-bind="attrs" v-on="on">{{topicSort}}</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(t, i) in topics" :key="i" link>
                <v-list-item-title
                  v-text="t.topictext"
                  style='font-size: 10pt;'
                  @click="filterTopic(t)"
                >
                </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-date-picker 
            v-if="showDate"
            v-model="afterDate"
            :max="today"
            elevation="6"
            @click:date="filterDate()"
        >
        </v-date-picker>
      </v-row>

      <!-- Entries list -->
      <v-col class="small-entries-list" v-if="entriesList.length !== 0">
        <h3 class="text-center"
          :style="{'width': isMobile ? '100%' : null}"
        >
          {{filterMethod}}
        </h3>
        <v-row justify="center" align="center" v-for="(entry, i) in entriesList" :key="i">
          <v-card class="card" elevation="5"
            :width="isMobile ? '100%' : windowWidth >= 700 ? '60%' : windowWidth >= 600 ? '70%' : '85%'"
          >
            <v-card-title class="card-title">
              {{entry.prompttext}}
            </v-card-title>
            <v-card-subtitle>
              <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
            </v-card-subtitle>
            <v-card-text v-if="viewState === 'Save' && entryToEdit === entry.entryid">
              <v-textarea
                :value="entry.text"
                @input="textChanged($event)"
              >
              </v-textarea>
            </v-card-text>
            <v-card-text v-else>
              {{entry.text}}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#bdd0e7"
                    v-bind="attrs"
                    v-on="on"
                    @click="getSharedList(entry)"
                  >
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </template>
                <span>Share</span>
              </v-tooltip>
              <v-btn color="#cccccc" @click="deleteEntry(entry)">Delete</v-btn>
              <v-btn
                color="#abddd0"
                :disabled="entryToEdit === null ? false : entryToEdit === entry.entryid ? false : true" 
                @click="(viewState === 'Edit') ? editMode(entry) : updateEntry(entry)"
              >
                {{(entryToEdit === null) ? viewState : (entryToEdit === entry.entryid) ? "Save" : "Edit"}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
      <v-col class="small-entries-list" v-else>
        <h3 class="text-center"
          v-if="entriesList.length === 0"
          :style="{'width': isMobile ? '100%' : null}"
        >
          No Entries Found For: <br v-if="isMobile">{{filterMethod}}
        </h3>
      </v-col>
      <Share v-show="showShare" @close-modal="showShare = false" />
    </v-col>
  </v-app>
</template>

<script>
import Share from '~/components/Share.vue'
export default {
  name: 'EntriesPage',
  middleware: "auth",

  components: {
    Share
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  mounted () {
    this.$store.dispatch('journal/loadEntries')
    this.$store.dispatch('journal/loadTopics')
  },

  data () {
    return {
      sortByTopic: false,
      sortByDate: true,
      dateHint: "Filter Date",
      afterDate: "",
      topicSort: "Filter Topic",
      showDate: false,
      filterMethod: "Entries Today",
      viewState: "Edit",
      entryToEdit: null,
      response: "",
      showShare: false,
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    textChanged (event) {
      this.response = event
    },

    editMode (entry) {
      this.viewState = "Save"
      this.entryToEdit = entry.entryid
      this.response = entry.text
    },

    updateEntry (e) {
      this.viewState = "Edit"
      let temp = ""
      if (this.filterMethod === "Entries Today") temp = "today"
      else if (this.filterMethod.split(':')[0] === "Entries Since") temp = this.afterDate
      else if (this.filterMethod.split(':')[0] === "Entries About") temp = e.topicid
      this.$store.dispatch('journal/updateEntry', {
        entryid: e.entryid,
        text: this.response,
        filterMethod: temp,
        userid: this.user.id
      })
      this.entryToEdit = null
    },

    async deleteEntry(e) {
      if (confirm('Are you sure you want to delete this entry?')) {
        let temp = ""
        if (this.filterMethod === "Entries Today") temp = "today"
        else if (this.filterMethod.split(':')[0] === "Entries Since") temp = this.afterDate
        else if (this.filterMethod.split(':')[0] === "Entries About") temp = e.topicid
        await this.$store.dispatch('journal/deleteEntry', {
          entryid: e.entryid,
          filterMethod: temp,
          userid: this.user.id
        })
      }
    },

    loadEntries () {
      this.filterMethod = "Entries Today"
      this.dateHint = "Filter Date"
      this.topicSort = "Filter Topic"
      this.afterDate = ""
      this.$store.dispatch('journal/loadEntries')
    },

    filterDate () {
      this.topicSort = "Filter Topic"
      this.showDate = !this.showDate
      const temp = this.afterDate.split('-')
      this.filterMethod = "Entries Since: " + temp[1] + ' / ' + temp[2] + ' / ' + temp[0]
      this.$store.dispatch('journal/filterDate', {
        afterDate: this.afterDate,
        userid: this.user.id
      })
    },

    filterTopic (t) {
      this.showDate = false
      this.afterDate = ""
      this.topicSort = t.topictext
      this.filterMethod = "Entries About: " + this.topicSort
      this.$store.dispatch('journal/filterTopic', {
        topicid: t.topicid,
        userid: this.user.id
      })
    },

    getSharedList (entry) {
      this.showShare = true
      this.$store.dispatch('share/getSharedList', {
        entry: entry, //entry.entryid
        // prompt: entry, //entry.promptid
      })
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    }
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
    },

    entriesList () {
      return this.$store.state.journal.entriesList
    },

    topics () {
      return this.$store.state.journal.topics
    },

    today () {
      const year = new Date().getFullYear()
      let month = parseInt(new Date().getMonth()) + 1
      if (month < 10) month = '0' + month.toString()
      let day = parseInt(new Date().getDate())
      if (day < 10) day = '0' + day.toString()
      return year + "-" + month + '-' + day
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r750|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';
.card {
  margin-top: 20px;
}

h2, h3 {
  width: 80%;
  margin: auto;
}

.rowBtn {
  margin-right: 5px;
}

.colBtn {
  margin-bottom: 5px;
}

.small-entries-list {
  margin-top: 10px;
}

</style>
