import { API } from "~/store/api"

export const state = () => ({
      newestEntry: {},
      entriesList: [],
      topics: [],
  })
  
// mutations should update state
export const mutations = {
    newestEntry(state, data) {
      state.newestEntry = data
    },

    entriesList(state, data) {
      state.entriesList = data
    },

    topics(state, data) {
      state.topics = data
    }
}

// actions should call mutations
export const actions = {
  async submit({ commit }, { response, userid, promptid }) {
    const res = await this.$axios.post(`/api/entries`, {
            response: response,
            date: await todayTimestamp(),
            userid: userid,
            promptid: promptid
        })
    if (res.status === 201) {
        await commit('newestEntry', res.data)
        localStorage.setItem('newestEntry', JSON.stringify(res.data))
        alert('Your journal entry has been successfully submitted')
        return res.data
    }
  },

  async loadEntries({ commit, rootState }) {
    let today = await todayTimestamp()
    let userid = JSON.parse(rootState.accounts.user).id
    try {
      const res = await this.$axios.get(`/api/entries/${userid}/${today}`)
      if (res.status === 200) {
        for (let i = 0; i < res.data.length; ++i) {
          res.data[i].date = await parseDate(res.data[i].date)
        }
        await commit('entriesList', res.data)
        localStorage.setItem('entriesList', JSON.stringify(res.data))
      }
    } catch (err) {
      if (err.response.status === 404) {
        await commit('entriesList', [])
        localStorage.setItem('entriesList', JSON.stringify([]))
      }
    }
  },

  async loadTopics({ commit }) {
    const topics = await this.$axios.get(`/api/topics`)
    if (topics.status === 200) {
      await commit('topics', topics.data)
    }
  },

  async updateEntry({ dispatch }, { entryid, text, filterMethod, userid }) {
    try {
      let afterDate = ""
      let topicid = null;
      (filterMethod.toString().length === 1) ? topicid = filterMethod : afterDate = filterMethod
      const res = await this.$axios.put(`/api/entries/${entryid}`, {
        text: text
      })
      if (res.status === 200) {
        //alert(`Entry number ${entryid} has been updated`)
        if (filterMethod === "today") dispatch('loadEntries')
        else {
          (topicid === null)
            ? await dispatch('filterDate', { afterDate, userid })
            : await dispatch('filterTopic', { topicid, userid })
        }
      }
    } catch (err) {
        if (err.response.status === 400) {
          alert('Something went wrong, please refresh the page and try again')
        }
      }
  },

  async deleteEntry({ dispatch }, { entryid, filterMethod, userid }) {
    try {
      let afterDate = ""
      let topicid = null;
      (filterMethod.toString().length === 1) ? topicid = filterMethod : afterDate = filterMethod
      const res = await this.$axios.delete(`/api/entries/${entryid}`)
      if (res.status === 204) {
        //alert(`Entry number ${entryid} has successfully been deleted`)
        if (filterMethod === "today") dispatch('loadEntries')
        else {
          (topicid === null)
            ? await dispatch('filterDate', { afterDate, userid })
            : await dispatch('filterTopic', { topicid, userid })
        }
      }
    } catch (err) {
        if (err.response.status === 400) {
          alert('Something went wrong, please refresh the page and try again')
        }
      }
  },

  async filterDate({ commit }, { afterDate, userid }) {
    await commit('entriesList', [])
    afterDate += 'T00:00:00.000Z'
    const res = await this.$axios.get(`/api/entries?afterdate=${afterDate}&userid=${userid}`)
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; ++i) {
        res.data[i].date = await parseDate(res.data[i].date)
      }
      await commit('entriesList', res.data)
      localStorage.setItem('entriesList', JSON.stringify(res.data))
    }
  },

  async filterTopic({ commit }, { topicid, userid }) {
    await commit('entriesList', [])
    const res = await this.$axios.get(`/api/entries?topicid=${topicid}&userid=${userid}`)
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; ++i) {
        res.data[i].date = await parseDate(res.data[i].date)
      }
      await commit('entriesList', res.data)
      localStorage.setItem('entriesList', JSON.stringify(res.data))
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
    let fullDate = year + '-' + month + '-' + date + 'T00:00:00.000Z'
    return fullDate
}

async function parseDate(date) {
  let prettyDate = ""
  const yearMonth = date.split('-')
  let day = yearMonth[2].split('T')
  prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
  return prettyDate
}
