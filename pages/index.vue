<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col>
          <h2 class="text-center" v-if="windowWidth >= 850">Submit Your Entry Here!</h2>
          <h3 class="text-center"
            :style="{'width': windowWidth < 600 ? '100%' : null}" 
            v-else-if="windowWidth < 850"
          >
            Submit Your Entry Here!
          </h3>
          <v-row justify="center" align="center">
            <v-card class="card" elevation="5"
              :width="windowWidth < 600 ? '90%' : '450px'"
              v-if="prompt !== null && prompt !== undefined"
            >
              <v-card-title class="card-title">
                {{isFreeWrite ? freePrompt : prompt.prompttext}}
              </v-card-title>
              <v-card-subtitle>
                <i>{{isFreeWrite ? freePrompt : prompt.topictext}}</i>
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  v-model="response"
                  placeholder="Enter your response here"
                >
                </v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="card-btn"
                      color="#d3d3d3"
                      v-bind="attrs"
                      v-on="on"
                      @click="freeWrite()"
                    >
                      <v-icon>mdi-text-box-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>{{isFreeWrite ? 'Stop Free Write' : 'Start Free Write'}}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="#bdd0e7"
                      v-bind="attrs"
                      v-on="on"
                      @click="newPrompt()"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>New Prompt</span>
                </v-tooltip>
                <v-btn color="#abddd0" @click="submit()">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  mounted() {
    this.$store.commit('accounts/setPrompt', JSON.parse(localStorage.getItem('prompt')))
    this.$store.dispatch('accounts/activePrompt')
  },

  data () {
    return {
      isFreeWrite: false,
      freePrompt: 'Free Write',
      response: "",
      hover: false,
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    freeWrite () {
      this.isFreeWrite = !this.isFreeWrite
    },

    async newPrompt () {
      await this.$store.dispatch('accounts/getPrompt', { isNew: false })
      this.isFreeWrite = false
    },

    submit () {
      this.$store.dispatch('journal/submit', {
        response: this.response,
        userid: this.user.id,
        promptid: this.isFreeWrite ? 0 : this.prompt.promptid
      })
      this.response = ""
      this.isFreeWrite = false
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    prompt () {
      return this.$store.state.accounts.prompt
    },

    newestEntry () {
      return this.$store.state.journal.newestEntry
    },

    userGroups () {
      return this.$store.state.group.userGroups
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

.card-btn {
  margin-right: 8px;
}

h2, h3 {
  width: 500px;
  margin: auto;
}

</style>
