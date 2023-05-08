import { API } from "~/store/api"

export const state = () => ({
    notifs: [],
    newNotif: false,
})

// mutations should update state
export const mutations = {
    setNotifs(state, data) {
        state.notifs = data
    },

    newNotif(state, data) {
        state.newNotif = data
    }
}

// actions should call mutations
export const actions = {
    async getNotifs({ commit, rootState }, {}) {
        const userid = JSON.parse(rootState.accounts.user).id
        try {
            const res = await this.$axios.get(`/api/notifications?userid=${userid}`)
            if (res.status === 200) {
                let newNotif = false
                for (let i = 0; i < res.data.length; ++i) {
                    res.data[i].date =  await parseDate(res.data[i].date)
                    if (!res.data[i].seen) newNotif = true
                }
                await commit('newNotif', newNotif)
                await commit('setNotifs', res.data)
            }
        } catch (err) {
            console.log(err)
            await commit('setNotifs', [])
        }
    },

    async sendNotif({ rootState }, { userid, journalid, text, title }) {
        try {
            const name = `${JSON.parse(rootState.accounts.user).firstname} ${JSON.parse(rootState.accounts.user).lastname}`
            const res = await this.$axios.post(`/api/notifications`, {
                    userid: userid,
                    senderid: JSON.parse(rootState.accounts.user).id,
                    sendername: name,
                    date: await todayTimestamp(),
                    journalid: journalid,
                    text: text,
                    title: title,
                })
            if (res.status === 201) {
                console.log('notification sent')
            }
        } catch (err) {
            console.log(err)
        }
    },

    async markRead({ dispatch }, { notifid }) {
        try {
            const res = await this.$axios.put(`/api/notifications/${notifid}`, {
                seen: true
            })
            if (res.status === 200) {
                await dispatch('getNotifs', {})
            }
        } catch (err) {
            console.log(err)
        }
    },

    async markAllAsRead({ commit, rootState }, {}) {
        try {
            const userid = JSON.parse(rootState.accounts.user).id
            const res = await this.$axios.put(`/api/notifications?userid=${userid}`)
            if (res.status === 200) {
                for (let i = 0; i < res.data.length; ++i) {
                    res.data[i].date =  await parseDate(res.data[i].date)
                }
                await commit('setNotifs', res.data)
                await commit('newNotif', false)
            }
        } catch (err) {
            console.log(err)
        }
    }
}


/// External functions

async function todayTimestamp() {
    let year = new Date().getFullYear()
    let month = parseInt(new Date().getMonth()) + 1
    if (month < 10) month = '0' + month.toString()
    let date = parseInt(new Date().getDate())
    if (date < 10) date = '0' + date.toString()
    let hour = parseInt(new Date().getHours())
    if (hour < 10) hour = '0' + hour.toString()
    let min = parseInt(new Date().getMinutes())
    if (min < 10) min = '0' + min.toString()
    let fullDate = year + '-' + month + '-' + date + `T${hour}:${min}:00.000Z`
    return fullDate.toString()
}

async function parseDate(date) {
    let prettyDate = ""
    const yearMonth = date.split('-')
    let day = yearMonth[2].split('T')
    let time = day[1].split(':')
    let hour = time[0]
    let timeOfDay = 'AM'
    if (hour >= 12) {
        timeOfDay = 'PM'
        if (hour > 12) hour -= 12
    }
    prettyDate += `${yearMonth[1]}-${day[0]}-${yearMonth[0]}\n${hour}:${time[1]} ${timeOfDay}`
    return prettyDate
}
