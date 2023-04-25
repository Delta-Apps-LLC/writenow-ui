export const state = () => ({
    userGroups: [
        {
            groupid: 1,
            groupname: 'Thibs',
            joincode: 'abcdefg',
        },
        {
            groupid: 2,
            groupname: 'Bucks',
            joincode: 'hijklmn',
        },
        {
            groupid: 3,
            groupname: 'Friends',
            joincode: 'opqrstu',
        },
    ],
})

// mutations should update state
export const mutations = {

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
