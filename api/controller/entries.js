const entries = require('../database/entries')

module.exports = function (pool) {
    return {
        async submitEntry (req, res) {
            const { response, date, userid, promptid } = req.enforcer.body
            const entry = await entries.submit(pool, response, date, userid, promptid)
			if (entry !== null && entry !== undefined) {
				res.enforcer.status(201).send(entry)
			} else {
				res.enforcer.status(409).send()
			}
        },

        async getEntriesToday(req, res) {
            const { userid, today } = req.enforcer.params
            const todayEntries = await entries.getToday(pool, today, userid)
            if (todayEntries !== null && todayEntries !== undefined) {
				res.enforcer.status(200).send(todayEntries)
			} else {
				res.enforcer.status(404).send()
			}
        },

        async filterEntries (req, res) {
            const afterDate = req.enforcer.query.afterdate
            const topicid = req.enforcer.query.topicid
            const userid = req.enforcer.query.userid
            if (topicid !== undefined) {
                const filtered = await entries.filterTopic(pool, topicid, userid)
                if (filtered !== null && filtered !== undefined) {
                    res.enforcer.status(200).send(filtered)
                } else {
                    res.enforcer.status(404).send()
                }
            }
            else if (afterDate !== undefined) {
                const filtered = await entries.filterDate(pool, afterDate, userid)
                if (filtered !== null && filtered !== undefined) {
                    res.enforcer.status(200).send(filtered)
                } else {
                    res.enforcer.status(404).send()
                }
            }
        },
        
        async updateEntry (req, res) {
            const { entryid } = req.enforcer.params
            const { text } = req.enforcer.body
            const response = await entries.updateEntry(pool, entryid, text)
            if (response !== null && response !== undefined) {
                res.enforcer.status(200).send()
            } else {
                res.enforcer.status(404).send()
            }
        },
        
        async deleteEntry (req, res) {
            const { entryid } = req.enforcer.params
            const response = await entries.deleteEntry(pool, entryid)
            if (response > 0) {
                res.enforcer.status(204).send()
            } else {
                res.enforcer.status(400).send()
            }
        },
        
    }
}