<template>
    <v-app>
      <v-row>
        <v-col class="intro-page">
          <div class="full-intro" :style="{'width': windowWidth < 750 ? '80%' : null}">
            <h3 class="text-center" v-if="windowWidth >= 750"
            >
              The new way to journal!
            </h3>
            <h4 class="text-center" v-else-if="windowWidth < 750"
            >
              The new way to journal!
            </h4>
            <div class="intro text-center" v-if="!isMobile">
              Don't know what to write? <em>We'll tell you.</em><br>
              Can't remember to write? <em>We'll remind you.</em><br>
              Don't have a lot to say? <em>That's just fine.</em>
            </div>
            <div class="intro text-center" v-if="isMobile">
              Don't know what to write? <br><em>We'll tell you.</em><br>
              Can't remember to write? <br><em>We'll remind you.</em><br>
              Don't have a lot to say? <br><em>That's just fine.</em>
            </div>
          </div>
          <v-divider class="intro-divider" />

          <!-- Row 1 -->
          <v-row class="intro-rows" align="center" v-if="windowWidth >= 750">
            <v-col>
              <span class="intro">
                This no-excuses app prompts you to keep track of your feelings, hopes, and dreams. Don't like the prompt? <em>Generate a new one!</em>
              </span>
            </v-col>
            <v-col>
              <img class="intro-img" src="~/assets/images/home-screen.png">
            </v-col>
          </v-row>

          <!-- Row 1 Small Window -->
          <v-row class="intro-rows" align="center" justify="center" v-else-if="windowWidth < 750">
            <v-col>
              <p class="intro text-center">
                This no-excuses app prompts you to keep track of your feelings, hopes, and dreams. Don't like the prompt? <em>Generate a new one!</em>
              </p>
              <img :style="{'width': windowWidth < 600 ? '380px' : null}" class="intro-img" src="~/assets/images/home-screen.png">
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />

          <!-- Row 2 -->
          <v-row class="intro-rows" align="center" v-if="windowWidth >= 750">
            <v-col>
              <img class="intro-img" src="~/assets/images/my-entries.png">
            </v-col>
            <v-col>
              <span class="intro">
                Head to the "My Entries" page to see all of your journal submissions. Filter them by date or topic!
              </span>
            </v-col>
          </v-row>

          <!-- Row 2 Small Window -->
          <v-row class="intro-rows" align="center" v-else-if="windowWidth < 750">
            <v-col>
              <p class="intro">
                Head to the "My Entries" page to see all of your journal submissions. Filter them by date or topic!
              </p>
              <img :style="{'width': windowWidth < 600 ? '380px' : null}" class="intro-img" src="~/assets/images/my-entries.png">
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />

          <!-- Row 3 -->
          <v-row class="intro-rows" align="center" v-if="windowWidth >= 750">
            <v-col>
              <span class="intro">
                Stay connected with those you love by sharing your entry submissions with them. Or, share the prompt itself to see how they respond!
              </span>
            </v-col>
            <v-col>
              <img class="intro-img" src="~/assets/images/share.png">
            </v-col>
          </v-row>

          <!-- Row 3 Small Window -->
          <v-row class="intro-rows" align="center" v-else-if="windowWidth < 750">
            <v-col>
              <p class="intro">
                Stay connected with those you love by sharing your entry submissions with them. Or, share the prompt itself to see how they respond!
              </p>
              <img :style="{'width': windowWidth < 600 ? '380px' : null}" class="intro-img"  src="~/assets/images/share.png">
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />
          
          <!-- Row 4 -->
          <v-row class="intro-rows" align="center" v-if="windowWidth >= 750">
            <v-col>
              <img class="intro-img" src="~/assets/images/shared-with-me.png">
            </v-col>
            <v-col>
              <span class="intro">
                Check out the "Shared With Me" page to see what your loved ones have sent you! Respond to shared prompts and they will immediately see your response!
              </span>
            </v-col>
          </v-row>

          <!-- Row 4 Small Window -->
          <v-row class="intro-rows" align="center" v-else-if="windowWidth < 750">
            <v-col>
              <p class="intro">
                Check out the "Shared With Me" page to see what your loved ones have sent you! Respond to shared prompts and they will immediately see your response!
              </p>
              <img :style="{'width': windowWidth < 600 ? '380px' : null}" class="intro-img" src="~/assets/images/shared-with-me.png">
            </v-col>
          </v-row>

        </v-col>

        <!-- Sign in Form -->
        <!-- <v-col :cols="windowWidth < '960' ? null : '4'">
            <v-row justify="center" align="center">
              <v-card class="card"
                elevation="5"
                :width="windowWidth < 750 ? 300 : 350"
                :style="{'position': windowWidth < 960 ? 'relative' : 'fixed'}"
              >
                <v-card-title class="headline" style="color: #575757">
                    <em>Sign In Here</em>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        class="selector"
                        background-color="#f0f0f0"
                        dense
                        solo
                        rounded
                        v-model="email"
                        :append-icon="'mdi-email'"
                        placeholder="Enter your email"
                    >
                    </v-text-field>
                    <v-text-field
                        class="selector"
                        background-color="#f0f0f0"
                        dense
                        solo
                        rounded
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        v-model="password"
                        @keyup.enter="login()"
                        placeholder="Enter your password"
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <nuxt-link to="/signup">Join Here</nuxt-link>
                    <span>&nbsp;</span>
                    <v-btn color="#abddd0" nuxt @click="login()">
                        Sign In
                    </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <br v-if="windowWidth < '850'">
        </v-col> -->
      </v-row>
    </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  data () {
    return {
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    resizeHandler() {
      this.windowWidth = window.innerWidth
    }
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
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

.intro-page {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.full-intro {
  width: 60%;
  margin: auto;
  background-color: #FAF9F6;
  border-radius: 20px;
  box-shadow: 0px 0px 6px #575757;
}

h3 {
  font-size: 25px;
  color: #575757;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

h4 {
  font-size: 20px;
  color: #575757;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.intro {
  font-size: 20px;
  color: #575757;
  font-family: Cochin;
}

.intro-rows {
  margin-top: 20px;
}

.intro-divider {
  margin-top: 20px;
}

.intro-img {
  border-radius: 10px;
  box-shadow: 0px 0px 4px #575757;
  width: 500px;
  margin: auto;
  display: block;
}


</style>
