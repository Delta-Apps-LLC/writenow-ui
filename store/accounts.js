import { API, decodeToken, retrieveToken, setToken } from "~/store/api"
import axios from "axios"

export const state = () => {
    return {
        user: decodeToken(retrieveToken()),
        prompt: {},
        notifTime: "",
        isNew: false,
    }
}
  
// mutations should update state
export const mutations = {
  setUser(state, cookieValue) {
      state.user = cookieValue
  },

  setPrompt(state, data) {
    state.prompt = data
  },

  notifTime(state, data) {
      state.notifTime = data
  },

  setIsNew(state, data) {
    state.isNew = data
  },
}

// actions should call mutations
export const actions = {
    async checkHealth({ commit }) {
        try {
            const res = await this.$axios.get(`${API}/api/health`)
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    },

    async getPrompt({ commit, state }, { isNew }) {
        // generate new prompt
        const response = await this.$axios.get(`${API}/api/prompts`, {
            headers: {
                Authorization: `Bearer ${retrieveToken()}`
            }
        })
        if (response.status === 200) {
            await commit('setPrompt', response.data)
            localStorage.setItem('prompt', JSON.stringify(response.data))
            
            // new user signing up
            if (isNew) {
              try {
                // add that new prompt to active_prompt table
                const res = await this.$axios.post(`${API}/api/prompts`, {
                    userid: JSON.parse(state.user).id,
                    promptid: response.data.promptid,
                    dateadded: new Date().toDateString()
                }, {
                    headers: {
                        Authorization: `Bearer ${retrieveToken()}`
                    }
                })
                if (res.status === 201) {
                }
              } catch (err) {
                  console.log(err)
              }
          }
          // not a new user
          else {
              try {
                // update the user's active prompt
                const res = await this.$axios.put(`${API}/api/prompts/${state.user.id}`, {
                    promptid: response.data.promptid,
                    dateadded: new Date().toDateString()
                }, {
                    headers: {
                        Authorization: `Bearer ${retrieveToken()}`
                    }
                })
                if (res.status === 200) {
                    console.log('Success!')
                }
              } catch (err) {
                  console.log(err)
              }
          }
        }
    },

    async activePrompt({ commit, dispatch, state }) {
        const today = new Date().toDateString()
        try {
            // get the user's active prompt
            const active_prompt = await this.$axios.get(`${API}/api/prompts/${state.user.id}`, {
                headers: {
                    Authorization: `Bearer ${retrieveToken()}`
                }
            })
            // prompt is old, get a new one
            if (active_prompt.data.dateadded !== today) {
                await dispatch('getPrompt', { isNew: false })
            }
            // maintain current active prompt
            else {
                await commit('setPrompt', active_prompt.data)
                localStorage.setItem('prompt', JSON.stringify(active_prompt.data))
            }
        } catch (err) {
            // do something
        }
    },

    async signup({ dispatch, commit }, { firstname, lastname, username, password }) {
        try {
            const response = await axios.post(`${API}/api/accounts`, {
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password
            })
            if (response.status === 201) {
                dispatch('login', {
                    username: username, password: password, isNew: true
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    async login({ dispatch, commit }, { username, password, isNew }) {
        try {
            const response = await this.$axios.put(`${API}/api/authentication/login`, {
                username,
                password,
                isNew
            })
            if (response.status === 200) {
                setToken(response.data)
                await commit('setUser', decodeToken(retrieveToken()))
                await commit('setIsNew', isNew)
                this.$router.push('/')
                isNew ? dispatch('getPrompt', { isNew: true }) : dispatch('activePrompt')
            }
        } catch (err) {
            console.log(err)
            this.$router.push('/login')
            if (err.response.status === 401) {
                alert('Email or password is incorrect.')
            } else {
                alert('Something went wrong, please try again.')
            }
        }
    },

    async logout ({ commit }) {
        const res = await this.$axios.get(`${API}/api/authentication/logout`)
        if (res.status === 200) {
            localStorage.removeItem('prompt')
            localStorage.removeItem('newestEntry')
            localStorage.removeItem('entriesList')
            localStorage.removeItem('tab')
            localStorage.removeItem('accessToken')
            commit('setUser', null)
            this.$router.push('/login')
        }
    },

    async getNotifTime({ commit, state }) {
        try {
            const res = await this.$axios.get(`${API}/api/accounts/${state.user.id}`, {
                headers: {
                    Authorization: `Bearer ${retrieveToken()}`
                }
            })
            if (res.status === 200) {
                await commit('notifTime', prettyTime(res.data.notif_time))
            }
        } catch (err) {
            if (err.response.status === 404 || err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async update({ dispatch }, { currentPass, newPass, notif_time, userid }) {
        try {
            if (currentPass === undefined && newPass === undefined && notif_time !== undefined) {
                const res = await this.$axios.put(`${API}/api/accounts/${userid}?notif_time=${notif_time}`, {
                    headers: {
                        Authorization: `Bearer ${retrieveToken()}`
                    }
                })
                if (res.status === 200) {
                    alert('Your notification time has been successfully updated. It will take effect in the next day.')
                    await dispatch('getNotifTime')
                }
            } else if (currentPass !== undefined && newPass !== undefined && notif_time === undefined) {
                const res = await this.$axios.put(`${API}/api/accounts/${userid}?currentPass=${currentPass}&newPass=${newPass}`, {
                    headers: {
                        Authorization: `Bearer ${retrieveToken()}`
                    }
                })
                if (res.status === 200) {
                    alert('Your password has been successfully updated')
                }
            } else if (currentPass !== undefined && newPass !== undefined && notif_time !== undefined) {
                const res = await this.$axios.put(`${API}/api/accounts/${userid}?currentPass=${currentPass}&newPass=${newPass}&notif_time=${notif_time}`, {
                    headers: {
                        Authorization: `Bearer ${retrieveToken()}`
                    }
                })
                if (res.status === 200) {
                    alert('Your password and notification time have been successfully updated. Your new notification time will take effect in the next day.')
                    await dispatch('getNotifTime')
                }
            }
        } catch (err) {
            if (err.response.status === 401) {
                alert('The current password you provided was incorrect')
            } else if (err.response.status === 403) {
                alert('You do not have permission to update this account')
            } else if (err.response.status === 404) {
                alert('Account not found')
            } else if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async delete({ commit }, { userid }) {
        try {
            const res = await this.$axios.delete(`${API}/api/accounts/${userid}`, {
                headers: {
                    Authorization: `Bearer ${retrieveToken()}`
                }
            })
            if (res.status === 204) {
                commit('setUser', null)
                localStorage.removeItem('prompt')
                localStorage.removeItem('newestEntry')
                localStorage.removeItem('entriesList')
                localStorage.removeItem('tab')
                this.$router.push('/signup')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
            else if (err.response.status === 403) {
                alert('You do not have permission to delete this account')
            }
        }
    }
}

export const getters = {
  isLoggedIn: state => {
    return state.user
  }
}


// Check if the user cookie is set and if so get the cookie value.
// This cookie is set in addition to the session cookie when the user
// authenticated, but this cookie is made accessible to the browser's
// JavaScript.
function getUserFromCookie () {
    const re = new RegExp("user=([^;]+)") 
    const value = re.exec(document.cookie)
    return value != null ? unescape(value[1]) : null
}


function prettyTime (time) {
    let hour = parseInt(time[0] + time[1])
    let timeOfDay = ""
    if (hour > 12) {
        hour -= 12
        timeOfDay = " PM"
    } else if (hour === 12) timeOfDay = " PM"
    else timeOfDay = " AM"
    if (hour < 10) hour = '0' + hour.toString()
    time = time.split(' ')
    time = time[0].split(':')
    return hour + ":" + time[1] + timeOfDay
}
