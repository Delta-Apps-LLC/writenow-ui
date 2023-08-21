<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-card
          class="card"
          v-if="user !== null && user !== undefined"
          elevation="5"
          width="400"
        >
          <v-card-title style="color: #575757; font-family: Cochin; font-size: 25px;">
            {{user.firstname}} {{user.lastname}}
          </v-card-title>
          <v-card-subtitle>
            {{user.username}}
          </v-card-subtitle>
          <v-card-text>
            Feedback? <a @click="showSurvey = true">Let us know</a>.
          </v-card-text>
          <v-card-text>
            <v-text-field
              class="selector"
              background-color="#bfcada"
              dense
              solo
              rounded
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              v-model="currentPass" 
              placeholder="Current Password"
            >
            </v-text-field>
            <v-text-field
              class="selector"
              background-color="#bfcada"
              dense
              solo
              rounded
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              v-model="newPass" 
              placeholder="New Password"
              @keyup.enter="updateAccount()"
            >
            </v-text-field>
            <span>Notification Time: {{notifTime}}</span>
            <v-icon @click="clearTime()">mdi-pencil</v-icon>
            <br>
            <span v-if="time.length !== 0">New Time: {{time}}</span>
            <v-time-picker
                v-if="showTime"
                v-model="time"
                elevation="6"
            >
            <v-btn
                text
                color="primary"
                @click="prettyTime()"
            >
                OK
            </v-btn>
            </v-time-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="#aaaaaa" @click="deleteAccount()">Delete Account</v-btn>
            <v-btn color="#abddd0" @click="updateAccount()">Update Account</v-btn>
          </v-card-actions>
        </v-card>
        <iframe v-if="showSurvey"
          src="https://docs.google.com/forms/d/e/1FAIpQLSc9CVQiYpsChk-02WOfVF_DMENcWP_jtCnoFS-QdZbYGwUj4g/viewform?embedded=true"
          width="640"
          height="709"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'AccountPage',
  middleware: "auth",

  mounted () {
    this.$store.dispatch('accounts/getNotifTime')
  },

  data () {
    return {
        currentPass: undefined,
        newPass: undefined,
        show1: false,
        show2: false,
        showTime: false,
        time: "",
        rawTime: "",
        showSurvey: false,
    }
  },

  methods: {
      async updateAccount() {
        if ((this.currentPass === undefined || this.newPass === undefined) && this.time === "") {
          alert('No updates have been made to your account')
        }
        else if ((this.currentPass !== undefined && this.newPass !== undefined) || this.time !== "") {
          let parseTime = undefined
          if (this.time !== "") {
            parseTime = new Date('January 1, 2000 ' + this.rawTime + ':00').toTimeString()
          }
          await this.$store.dispatch('accounts/update', {
              currentPass: this.currentPass === "" ? undefined : this.currentPass,
              newPass: this.newPass === "" ? undefined : this.newPass,
              notif_time: parseTime,
              userid: this.user.id
          })
          this.currentPass = undefined
          this.newPass = undefined
          this.time = ""
        }
      },

      async deleteAccount () {
        if (confirm('Are you sure you want to delete your account?')) {
          await this.$store.dispatch('accounts/delete', {
              userid: this.user.id
          })
        }
      },

      prettyTime () {
          this.rawTime = this.time
          this.showTime = false
          let timeOfDay = ""
          let hour = this.time[0] + this.time[1]
          if (parseInt(hour) > 12) {
              timeOfDay = " PM"
              hour -= 12
          } else timeOfDay = " AM"
          if (hour < 10 && timeOfDay === " PM") hour = '0' + hour.toString()
          this.time = hour + this.time[2] + this.time[3] + this.time[4] + timeOfDay
      },

      clearTime () {
          this.time = ""
          this.showTime = !this.showTime
      }
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
    },

    notifTime () {
      return this.$store.state.accounts.notifTime
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


</style>
