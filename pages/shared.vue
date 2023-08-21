<template>
  <v-app>
    <span>
      <v-tabs left v-model="tab">
        <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }} ({{item.tab === 'entries' ? sharedEntries.length : sharedPrompts.length}})
          </v-tab>
      </v-tabs>
    </span>
    <v-tabs-items v-model="tab">
      <v-col class="card-col" v-for="item in items" :key="item.tab">
        <v-tab-item>
          <v-card v-for="(entry, i) in item.tab === 'entries' ? sharedEntries : sharedPrompts" :key="i"
            class="card"
            :id="entry.hash"
            elevation="5"
            :width="windowWidth < 600 ? '90%' : '450'"
          >
            <v-card-title class="card-title">
              {{entry.prompttext}}
            </v-card-title>
            <v-card-subtitle v-if="item.tab === 'entries' && !isMobile">
              {{entry.firstname}} {{entry.lastname}}&nbsp;&nbsp;&nbsp;&nbsp;
              <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;
              {{entry.date}}
            </v-card-subtitle>
            <v-card-subtitle v-else-if="item.tab === 'prompts' && !isMobile">
              {{entry.firstname}} {{entry.lastname}}&nbsp;&nbsp;&nbsp;&nbsp;
              <em>{{entry.topictext}}</em>
            </v-card-subtitle>
            <v-card-subtitle v-if="item.tab === 'entries' && isMobile">
              {{entry.firstname}} {{entry.lastname}}<v-spacer />
              <em>{{entry.topictext}}</em><v-spacer />
              {{entry.date}}
            </v-card-subtitle>
            <v-card-subtitle v-else-if="item.tab === 'prompts' && isMobile">
              {{entry.firstname}} {{entry.lastname}}<v-spacer />
              <em>{{entry.topictext}}</em>
            </v-card-subtitle>
            <v-card-text v-if="item.tab === 'entries'">
              {{entry.text}}
            </v-card-text>
            <v-card-text v-else-if="item.tab === 'prompts'">
              <v-textarea
                v-model="response"
                placeholder="Enter your response here"
              >
              </v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="#cccccc" @click="item.tab === 'entries' ? removeEntry(entry) : removePrompt(entry)">Remove</v-btn>
              <v-btn color="#abddd0" v-if="item.tab === 'prompts'" @click="submit(entry)">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-col>
    </v-tabs-items>
  </v-app>
</template>

<script>
export default {
  name: 'SharedPage',
  middleware: "auth",

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  async mounted () {
    await this.$store.dispatch('share/getSharedWithMe', { userid: this.user.id })
    this.tab = parseInt(localStorage.getItem('tab')) ?? null
    const id = this.$route.params.hash
    if (id !== undefined && prompt !== undefined) {
      const el = document.querySelector(id)
      setTimeout(scrollToNotif, 500)
      function scrollToNotif () {
        el && el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
      }
    }
  },

  data () {
    return {
      tab: parseInt(localStorage.getItem('tab')) ?? null,
      items: [
        { tab: 'entries' },
        { tab: 'prompts' },
      ],
      response: "",
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    async removeEntry (entry) {
      await this.$store.dispatch('share/unshareEntry', {
        entry: entry,
        userid: this.user.id,
        type: "receiver"
      })
    },

    async removePrompt (entry) {
      await this.$store.dispatch('share/unsharePrompt', {
        promptid: entry.promptid,
        userid: this.user.id,
        sender: entry.userid
      })
    },

    async submit (entry) {
      const toShare = await this.$store.dispatch('journal/submit', {
        response: this.response,
        userid: this.user.id,
        promptid: entry.promptid
      })
      await this.$store.dispatch('share/shareEntry', {
        entry: toShare,
        owner: this.user.id,
        users: [entry.userid],
        title: `Response`,
      })
      await this.removePrompt(entry)
      this.response = ""
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    }
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
    },
    
    sharedEntries () {
      return this.$store.state.share.sharedEntries
    },

    sharedPrompts () {
      return this.$store.state.share.sharedPrompts
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

.card-col {
  display: grid;
  justify-content: center;
}

</style>
