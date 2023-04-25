<template>
    <div class="modal-overlay" @click="close()">
        <div :class="isMobile ? 'modal-mobile' : 'modal'" 
            @click.stop
            :style="{'height': (isMobile && isLogin === 0) ? '315px' : (isMobile && isLogin === 1) ? '420px' : (!isMobile && isLogin === 0) ? '315px' : '400px'}"
        >
            <v-btn-toggle
              mandatory
              rounded
              v-model="isLogin"
            >
              <v-btn @click="reset()">Login</v-btn>
              <v-btn @click="reset()">Signup</v-btn>
            </v-btn-toggle>
            <v-divider />
            <br>

            <v-row justify="center">
                <v-card class="card"
                    color="transparent"
                    elevation="0"
                    width="80%"
                >
                    <v-card-title class="headline" style="color: #575757">
                        <em>Sign {{isLogin === 0 ? 'In' : 'Up'}} Here</em>
                    </v-card-title>
                    <v-card-text>
                        <v-row v-if="isLogin === 1" justify="center">
                            <v-text-field
                                class="name-field"
                                background-color="#e4dfcd88"
                                dense
                                solo
                                rounded
                                v-model="firstname"
                                placeholder="First name"
                            >
                            </v-text-field>
                            <v-text-field
                                class="name-field"
                                background-color="#e4dfcd88"
                                dense
                                solo
                                rounded
                                v-model="lastname"
                                placeholder="Last name"
                            >
                            </v-text-field>
                        </v-row>
                        <v-row justify="center">
                            <v-text-field
                                class="selector"
                                background-color="#e4dfcd88"
                                dense
                                solo
                                rounded
                                v-model="email"
                                :append-icon="'mdi-email'"
                                placeholder="Enter your email"
                            >
                            </v-text-field>
                        </v-row>
                        <v-row justify="center">
                            <v-text-field
                                class="selector"
                                background-color="#e4dfcd88"
                                dense
                                solo
                                rounded
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show"
                                v-model="password"
                                @keyup.enter="(isLogin === 0) ? login() : signup()"
                                placeholder="Enter your password"
                            >
                            </v-text-field>
                        </v-row>
                        <v-row v-if="isLogin === 1">
                            <label class="age" for="age">
                                Age: {{(age == 60) ? age+'+' : age}}&nbsp;
                            </label>
                            <input v-model="age" type="range" id="age" min="1" max="60" />
                            <v-spacer />
                            <span class="age-restriction" v-if="age < 13">You must be 13 or older</span>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="#cccccc" @click="close()">Exit</v-btn>
                        <span>&nbsp;</span>
                        <v-btn color="#abddd0"
                            @click="isLogin === 0 ? login() : signup()"
                            :disabled="(isLogin === 1 && age < 13) ? true : false"
                        >
                            {{isLogin === 0 ? 'Login' : 'Signup'}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',

  mounted () {

  },

  data () {
    return {
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        age: 13,
        show: false,
        isLogin: 0
    }
  },

  methods: {
    close () {
        this.email = ""
        this.password = ""
        this.firstname = ""
        this.lastname = ""
        this.$emit('close-modal')
    },

    reset () {
        this.email = ""
        this.password = ""
        this.firstname = ""
        this.lastname = ""
    },

    async login () {
      if (this.email === "" || this.password === "") alert('No fields may be left blank')
      else {
          await this.$store.dispatch('accounts/login', {
            username: this.email.toLowerCase(),
            password: this.password,
            isNew: false
        })
      }
    },

    async signup () {
        if (this.firstname === "" || this.lastname === "" || this.email === "" || this.password === "") {
            alert('No fields may be left blank')
        }
        else if (this.password.length < 8) {
            alert('Password must be at least 8 characters')
        }
        else {
            await this.$store.dispatch('accounts/signup', {
                firstname: this.firstname,
                lastname: this.lastname,
                username: this.email.toLowerCase(),
                password: this.password
            })
        }
    },
  },

  computed: {
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
  background-color: #EBEBEB;
  height: 70%;
  width: 40%;
  margin-top: 8%;
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

.name-field {
    width: 48%;
    margin: 2px;
}

.age {
    font-size: 16px;
}

.age-restriction {
    font-size: 16px;
    color: rgb(216, 43, 43);
}

</style>
