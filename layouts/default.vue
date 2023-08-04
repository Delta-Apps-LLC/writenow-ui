<template>
  <v-app>
    <script src="https://cdn.jsdelivr.net/npm/shepherd.js@10.0.1/dist/js/shepherd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shepherd.js@10.0.1/dist/css/shepherd.css"/>

    <v-navigation-drawer
      :mini-variant="windowWidth < 1000 ? true : miniVariant"
      :clipped="true"
      fixed
      :permanent="isMobile ? mobilePermanent : true"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :id="'menu-step-'+i"
          :to="item.to"
          @click="item.click"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      color="#abddd0"
      :clipped-left="true"
      fixed
      app
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon 
            @click.stop="toggleMenu()"
            v-on="on"
            v-bind="attrs"
          />
        </template>
        <span>{{miniVariant ? 'Expand' : 'Collapse'}}</span>
      </v-tooltip>
      <img src="~/assets/images/logo-dark.png" width="200px" />
      <v-spacer />
      <v-toolbar-title style="font-family: Cochin;" v-if="user !== null && user !== undefined && !isMobile">
        {{user.firstname}} {{user.lastname}}
      </v-toolbar-title>

      <v-menu max-height="350px" max-width="375px"
          bottom
          transition="slide-y-transition"
          :offset-y="true"
          :close-on-content-click="true"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn id="nav-step-2" icon @click="loadNotifs()" v-bind="attrs" v-on="on">
              <v-icon size="30" :color="newNotif ? '#8ea9c9' : null">{{newNotif ? 'mdi-bell-alert' : 'mdi-bell'}}</v-icon>
            </v-btn>
          </template>

          <v-list outlined v-if="notifs.length !== 0">
            <v-list-item @click="markAllAsRead()">
              <v-list-item-title>
                Mark all as read
              </v-list-item-title>
            </v-list-item>

            <template v-for="(n, j) in notifs">

              <v-divider
                :key="j"
              ></v-divider>

              <v-list-item link dense three-line
                class="js-scroll-trigger"
                :key="j"
                @click="toNotif(n)"
              >
                <!-- :href="n.title === 'Shared Prompt' ? `/shared#prompt-${n.journalid}` : `/shared#entry-${n.journalid}`" -->
                <v-list-item-content>
                  <v-list-item-title
                    v-text="n.sendername"
                    style='font-size: 14.5px;'
                  >
                  </v-list-item-title>

                  <v-list-item-subtitle 
                    v-text="n.title"
                  >
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    <em>"{{n.text}}"</em>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-icon size="15">{{n.seen ? null : 'mdi-circle'}}</v-icon>
                  <v-list-item-action-text
                    v-text="n.date"
                    style="white-space: pre; text-align: right"
                  >
                  </v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>

          <v-list outlined v-else>
            <v-list-item>
              <v-list-item-title>
                No notifications to display
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      <v-btn id="nav-step-1" icon @click="toAccount()"><v-icon size="30">mdi-account</v-icon></v-btn>
    </v-app-bar>
    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
    >
      <span class="footer">&copy; {{ new Date().getFullYear() }} Delta Apps</span>
      &ensp;
      <a class="footer" target="_blank" href="https://deltaapps.dev/writenow/privacy_policy.pdf">Privacy Policy</a>
      &ensp;
      <v-divider vertical />
      &ensp;
      <a class="footer" target="_blank" href="https://deltaapps.dev/writenow/terms_conditions.pdf">Terms</a>
      <v-spacer />
      <span class="footer">{{contact}}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Shepherd from 'shepherd.js'
import { decodeToken, retrieveToken } from '~/store/api'
export default {
  name: 'DefaultLayout',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  mounted () {
    this.$store.commit('accounts/setUser', decodeToken(retrieveToken()))
    if (this.isNew) {
      this.addSteps()
      this.tour.start()
      this.tour.on('complete', this.onboardingComplete)
    }
    this.$store.dispatch('notifications/getNotifs', {})
  },

  data () {
    return {
      fixed: true,
      mobilePermanent: true,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Write Now',
      windowWidth: window.innerWidth,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-format-list-bulleted',
          title: 'My Entries',
          to: '/entries',
          click: this.loadEntries
        },
        {
          icon: 'mdi-account-group',
          title: 'Groups',
          to: '/groups',
        },
        {
          icon: 'mdi-share-variant',
          title: 'Shared With Me',
          to: '/shared',
          click: this.loadShared
        },
        {
          icon: 'mdi-account-cog',
          title: 'Account',
          to: '/account',
          click: this.loadTime
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          click: this.logout
        }
      ],
      contact: 'Contact Us - thibaudeauapps@gmail.com',
      tour: new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true
        }
      }),
    }
  },

  methods: {
    loadNotifs () {
      this.$store.dispatch('notifications/getNotifs', {})
    },

    async toNotif (n) {
      const prefix = n.title === 'Shared Prompt' ? 'prompt-' : 'entry-'
      const tab = n.title === 'Shared Prompt' ? 1 : 0
      localStorage.setItem('tab', tab)
      this.$router.push({ name: 'shared', params: {
        hash: `#${prefix}${n.journalid}`,
      }})
      if (!n.seen) {
        this.$store.dispatch('notifications/markRead', {
          notifid: n.notifid,
        })
      }
    },

    markAllAsRead () {
      this.$store.dispatch('notifications/markAllAsRead', {})
    },

    toggleMenu() {
      this.miniVariant = !this.miniVariant
      this.mobilePermanent = !this.mobilePermanent
    },

    toAccount () {
      this.$router.push('/account')
    },

    toHome () {
      this.$router.push('/')
    },
    
    logout() {
      this.$store.dispatch('accounts/logout')
    },

    loadEntries() {
      this.$store.dispatch('journal/loadEntries')
      this.$store.dispatch('journal/loadTopics')
    },

    loadShared() {
      localStorage.setItem('tab', 0)
      this.$store.dispatch('share/getSharedWithMe', { userid: this.user.id })
    },

    loadTime() {
      this.$store.dispatch('accounts/getNotifTime')
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    addSteps() {
      this.tour.addSteps([
        {
          id: 'step-1',
          title: 'Hello there!',
          text: 'Welcome to Write Now. Let\'s get you started on your tour!',
          buttons: [
            {
              text: 'Okay!',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-0',
          title: 'Submit entry',
          text: 'The home page is where you get your daily prompt. Log in and complete your journal entry here! You can also generate a different prompt or start a free write using the buttons.',
          attachTo: {
            element: '#menu-step-0',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-1',
          title: 'See past entries',
          text: 'This page is where all your journal entries are stored. Go here to see what you\'ve submitted today or filter them by date or topic! You can also choose to share your entries with others, or share the prompt itself!',
          attachTo: {
            element: '#menu-step-1',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-2',
          title: 'See what\'s been shared with you',
          text: 'Here, you can see all the entries and prompts that others have shared with you. For the prompts, completing them will automatically share your response back with the person who shared it with you!',
          attachTo: {
            element: '#menu-step-2',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-3',
          title: 'Account settings',
          text: 'The account page is where you can see and edit your account settings, or submit a feedback form to us!',
          attachTo: {
            element: '#menu-step-3',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'nav-step-1',
          title: 'Account settings',
          text: 'You can also get to your account page by clicking this button.',
          attachTo: {
            element: '#nav-step-1',
            on: 'bottom'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'nav-step-2',
          title: 'Notifications',
          text: 'Your notifications will show up here. You will be notified when someone shares an entry or a prompt with you, or when they respond to a prompt you shared with them!',
          attachTo: {
            element: '#nav-step-2',
            on: 'bottom'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'final-step',
          title: 'See you around!',
          text: 'That concludes our tour! Now, get to it!',
          buttons: [
            {
              text: 'Finish',
              action: this.tour.complete
            }
          ]
        },
      ]);
    },

    onboardingComplete () {
      console.log('Complete')
      this.$store.commit('accounts/setIsNew', false)
    },
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
    },

    notifs () {
      return this.$store.state.notifications.notifs
    },

    newNotif () {
      return this.$store.state.notifications.newNotif
    },

    isNew () {
      return this.$store.state.accounts.isNew
    },

    isMobile () {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r750|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
  }
}
</script>

<style scoped>
@import '~/assets/style.css';

.title-text {
    font-family: 'Courier New', Courier, monospace;
    color: #575757;
}

.icon {
    color: #8ea9c9;
}

</style>
