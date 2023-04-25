const prompts = require('../database/prompts')
const accounts = require('../database/accounts')

module.exports = function (pool) {
    return {
        async getPrompt (req, res) {
            const prompt = await prompts.getPrompt(pool)
            if (prompt) {
                res.enforcer.status(200).send(prompt)
            }
            else {
                res.enforcer.status(400).send()
            }
        },

        async activePrompt (req, res) {
            const { userid } = req.enforcer.params
            const activePrompt = await prompts.activePrompt(pool, userid)
            if (activePrompt !== null && activePrompt !== undefined) {
                res.enforcer.status(200).send(activePrompt)
            }
            else {
                res.enforcer.status(404).send()
            }
        },

        async setActivePrompt (req, res) {
            const { userid, promptid, dateadded } = req.enforcer.body
            const response = await prompts.setActivePrompt(pool, userid, promptid, dateadded)
            if (response !== null && response !== undefined) {
                res.enforcer.status(201).send()
            }
            else {
                res.enforcer.status(400).send()
            }
        },

        async updateActivePrompt (req, res) {
            const { promptid, dateadded } = req.enforcer.body
            const { userid } = req.enforcer.params
            const response = await prompts.updateActivePrompt(pool, userid, promptid, dateadded)
            if (response !== null && response !== undefined) {
                res.enforcer.status(200).send()
            }
            else if (response === null || response === undefined) {
                res.enforcer.status(404).send()
            }
            else {
                res.enforcer.status(400).send()
            }
        }
    }
}
