const share = require('../database/share')

module.exports = function (pool) {
    return {
        async search (req, res) {
            const searchText = req.enforcer.query.searchtext
            const entryid = req.enforcer.query.entryid
            if (searchText !== undefined) {
                const results = await share.search(pool, searchText)
                if (results !== undefined) {
                    res.enforcer.status(200).send(results)
                } else {
                    res.enforcer.status(404).send()
                }
            }
            else if (entryid !== undefined) {
                const results = await share.getSharedList(pool, entryid)
                if (results !== undefined) {
                    res.enforcer.status(200).send(results)
                } else {
                    res.enforcer.status(404).send()
                }
            }
        },

        async shareEntry(req, res) {
            const { entryid, owner, userid } = req.enforcer.body
            const count = await share.shareEntry(pool, entryid, owner, userid)
            if (count !== undefined) {
                res.enforcer.status(201).send()
            } else {
                res.enforcer.status(400).send()
            }
        },

        async sharePrompt(req, res) {
            const { userid } = req.enforcer.params
            const { promptid, sender } = req.enforcer.body
            const count = await share.sharePrompt(pool, promptid, userid, sender)
            if (count !== undefined) {
                res.enforcer.status(201).send()
            } else {
                res.enforcer.status(400).send()
            }
        },

        async unshareEntry(req, res) {
            const { entryid, userid } = req.enforcer.params
            const count = await share.unshareEntry(pool, entryid, userid)
            if (count !== undefined) {
                res.enforcer.status(204).send()
            } else {
                res.enforcer.status(400).send()
            }
        },

        async unsharePrompt(req, res) {
            const { userid } = req.enforcer.params
            const promptid = req.enforcer.query.promptid
            const sender = req.enforcer.query.sender
            const count = await share.unsharePrompt(pool, promptid, userid, sender)
            if (count !== undefined) {
                res.enforcer.status(204).send()
            } else {
                res.enforcer.status(400).send()
            }
        },

        async getSharedWithMe(req, res) {
            const type = req.enforcer.query.type
            const { userid } = req.enforcer.params
            if (userid === undefined || userid === null) res.enforcer.status(400).send();
            else {
                if (type == 'entries') {
                    const entries = await share.getEntriesSharedWithMe(pool, userid)
                    if (entries !== undefined) {
                        res.enforcer.status(200).send(entries)
                    } else {
                        res.enforcer.status(200).send([])
                    }
                } else if (type == 'prompts') {
                    const prompts = await share.getPromptsSharedWithMe(pool, userid)
                    if (prompts !== undefined) {
                        res.enforcer.status(200).send(prompts)
                    } else {
                        res.enforcer.status(200).send([])
                    }
                }
            }
        }
    }
}