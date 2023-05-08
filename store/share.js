import { API } from "~/store/api"

export const state = () => ({
    resultsE: [],
    resultsP: [],
    sharedList: [],
    entryBeingShared: null,
    promptBeingShared: null,
    sharedEntries: [],
    sharedPrompts: []
})

// mutations should update state
export const mutations = {
    updateResultsE(state, data) {
        state.resultsE = data
    },

    updateResultsP(state, data) {
        state.resultsP = data
    },

    entryBeingShared(state, data) {
        state.entryBeingShared = data
    },

    promptBeingShared(state, data) {
        state.promptBeingShared = data
    },

    setSharedList(state, data) {
        state.sharedList = data
    },

    setEntriesSharedWithMe(state, data) {
        state.sharedEntries = data
    },

    setPromptsSharedWithMe(state, data) {
        state.sharedPrompts = data
    }
}

// actions should call mutations
export const actions = {
    async search({ commit }, { searchText, sharing }) {
        try {
            const res = await this.$axios.get(`${API}/api/share?searchtext=${searchText}`)
            if (res.status === 200) {
                (sharing === 0) 
                    ? await commit('updateResultsE', res.data)
                    : await commit('updateResultsP', res.data)
            }
        } catch (err) {
            if (err.response.status === 404 || err.response.status === 400) {
                (sharing === 0) 
                    ? await commit('updateResultsE', undefined)
                    : await commit('updateResultsP', undefined)
            }
        }
    },

    async getSharedList({ commit }, { entry }) {
        await commit('entryBeingShared', entry)
        await commit('promptBeingShared', entry)
        try {
            const res = await this.$axios.get(`${API}/api/share?entryid=${entry.entryid}`)
            if (res.status === 200) {
                await commit('setSharedList', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('setSharedList', [])
            }
        }
    },

    async shareEntry({ dispatch }, { entry, owner, users, title }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await this.$axios.post(`${API}/api/share`, {
                    entryid: entry.entryid,
                    owner: owner,
                    userid: users[i]
                })
                if (res.status === 201) {
                    await dispatch('notifications/sendNotif', {
                        userid: users[i],
                        journalid: entry.entryid,
                        text: entry.text,
                        title: title,
                    },
                    { root: true })
                }
            }
            await dispatch('getSharedList', { entry: entry })
            alert('Your entry has successfully been shared')
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async sharePrompt({ dispatch }, { prompt, sender, users }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await this.$axios.post(`${API}/api/share/${users[i].userid}`, {
                    promptid: prompt.promptid,
                    sender: sender
                })
                if (res.status === 201) {
                    await dispatch('notifications/sendNotif', {
                        userid: users[i].userid,
                        journalid: prompt.promptid,
                        text: prompt.prompttext,
                        title: 'Shared Prompt',
                    },
                    { root: true })
                }
            }
            alert('This prompt has successfully been shared')
        } catch (err) {
            console.log(err)
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async unshareEntry({ dispatch }, { entry, userid, type }) {
        try {
            const res = await this.$axios.delete(`${API}/api/share/${entry.entryid}/${userid}`)
            if (res.status === 204) {
                (type === "owner")
                    ? await dispatch('getSharedList', { entry })
                    : await dispatch('getSharedWithMe', { userid })
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async unsharePrompt({ dispatch }, { promptid, userid, sender }) {
        try {
            const res = await this.$axios.delete(`${API}/api/share/${userid}?promptid=${promptid}&sender=${sender}`)
            if (res.status === 204) {
                await dispatch('getSharedWithMe', { userid })
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },

    async getSharedWithMe({ commit }, { userid }) {
        try {
            const res = await this.$axios.get(`${API}/api/share/${userid}?type=entries`)
            if (res.status === 200) {
                if (res.data.length !== 0) {
                    for (let i = 0; i < res.data.length; ++i) {
                        res.data[i].date = await parseDate(res.data[i].date)
                        res.data[i].hash = `entry-${res.data[i].entryid}`
                    }
                    await commit('setEntriesSharedWithMe', res.data)
                }
                else if (res.data.length === 0) await commit('setEntriesSharedWithMe', [])
            }
            const res2 = await this.$axios.get(`${API}/api/share/${userid}?type=prompts`)
            if (res2.status === 200) {
                if (res2.data.length !== 0) {
                    for (let i = 0; i < res2.data.length; ++i) {
                        res2.data[i].hash = `prompt-${res2.data[i].promptid}`
                    }
                    await commit('setPromptsSharedWithMe', res2.data)
                }
                else if (res2.data.length === 0) await commit('setPromptsSharedWithMe', [])
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please refresh the page and try again')
            }
        }
    },
}


/// External functions
async function parseDate(date) {
    let prettyDate = ""
    const yearMonth = date.split('-')
    let day = yearMonth[2].split('T')
    prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
    return prettyDate
}